const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const progressBar = document.getElementById('progress-bar');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');
const frameworkModal = document.getElementById('framework-modal');
const questionAnnouncer = document.getElementById('question-announcer');
const questionContentWrapper = document.getElementById('question-content-wrapper');

let quizQuestions = [];
let resultsData = {};
let currentQuestionIndex = 0;
let scores = { explorer: 0, villager: 0, townPlanner: 0 };
let modalKeydownHandler;
let elementFocusedBeforeModal;
let activeScreen = startScreen;

async function loadQuizData() {
    try {
        const response = await fetch('quiz-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        quizQuestions = data.quizQuestions;
        resultsData = data.resultsData;
    } catch (error) {
        console.error('Could not load quiz data:', error);
        // Display a user-friendly error message
        document.body.innerHTML = '<div class="text-center p-8"><h1>Error</h1><p>Could not load the quiz. Please try refreshing the page.</p></div>';
    }
}

function switchView(newScreen) {
    if (newScreen === activeScreen) return;

    anime.timeline({
        duration: 200,
        easing: 'easeOutQuad',
    })
    .add({
        targets: activeScreen,
        opacity: 0,
        complete: () => {
            activeScreen.setAttribute('hidden', 'true');
        }
    })
    .add({
        targets: newScreen,
        begin: () => {
            newScreen.removeAttribute('hidden');
            newScreen.style.opacity = 0;
        },
        opacity: 1,
        complete: () => {
            activeScreen = newScreen;
        }
    }, '+=50');
}


// Route handlers
function showHome() {
    switchView(startScreen);
    if (frameworkModal.open) frameworkModal.close();
}

function showQuiz(ctx) {
    const questionIndex = ctx.params.questionIndex ? parseInt(ctx.params.questionIndex) - 1 : 0;
    if (questionIndex < 0 || questionIndex >= quizQuestions.length) {
        page('/quiz/1');
        return;
    }

    // If we're navigating to a quiz route, load any existing state
    // or set up the state for this question
    const hasExistingState = loadQuizState();

    if (!hasExistingState) {
        // No saved state, start fresh from this question
        currentQuestionIndex = questionIndex;
        scores = { explorer: 0, villager: 0, townPlanner: 0 };
    } else {
        // We have saved state, make sure we're at the right question
        if (questionIndex !== currentQuestionIndex) {
            // User is trying to jump to a different question
            // Reset state and start from the requested question
            currentQuestionIndex = questionIndex;
            scores = { explorer: 0, villager: 0, townPlanner: 0 };
        }
    }

    switchView(quizScreen);
    if (frameworkModal.open) frameworkModal.close();
    displayQuestion();
    saveQuizState();
}

function showResults(ctx) {
    switchView(resultsScreen);
    if (frameworkModal.open) frameworkModal.close();

    const resultTypeParam = ctx.params.resultType;
    if (resultTypeParam) {
        // Direct navigation to a result URL
        const decodedResultType = decodeURIComponent(resultTypeParam);
        
        if (decodedResultType.includes(',')) {
            // It's a tie
            const tiedResultNames = decodedResultType.split(',');
            const roleKeys = tiedResultNames.map(name => {
                for (const key in resultsData) {
                    if (resultsData[key].name === name) {
                        return key;
                    }
                }
                return null;
            }).filter(Boolean); // Filter out any nulls if a name wasn't found

            if (roleKeys.length > 1) {
                displayTieResult(roleKeys);
            } else if (roleKeys.length === 1) {
                // If for some reason only one valid role is passed in a comma-separated list
                displayResult(resultsData[roleKeys[0]].name);
            } else {
                // No valid roles found
                page('/'); // Or show an error
            }

        } else {
            // It's a single result
            displayResult(decodedResultType);
        }
        clearQuizState();
    } else {
        // Coming from the quiz
        const hasExistingState = loadQuizState();

        if (!hasExistingState && currentQuestionIndex < quizQuestions.length) {
            page('/');
            return;
        }

        calculateAndProcessResult();
        clearQuizState();
    }
}

function calculateAndProcessResult() {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const highestScore = sortedScores[0][1];
    const topRoles = sortedScores.filter(score => score[1] === highestScore).map(role => role[0]);

    if (topRoles.length === 1) {
        const resultType = topRoles[0];
        const resultName = resultsData[resultType].name;
        page.redirect(`/results/${encodeURIComponent(resultName)}`);
    } else {
        topRoles.sort();
        const tiedResultNames = topRoles.map(role => resultsData[role].name);
        page.redirect(`/results/${encodeURIComponent(tiedResultNames.join(','))}`);
    }
}

function displayTieResult(topRoles) {
    topRoles.sort(); // Sort alphabetically for a canonical display
    const roleNames = topRoles.map(role => resultsData[role].name);
    
    let tiedRolesText = roleNames.join(', ');
    if (roleNames.length > 1) {
        const last = roleNames.pop();
        tiedRolesText = `${roleNames.join(', ')} and ${last}`;
    }

    resultTitle.textContent = `You have a tie between ${tiedRolesText}!`;
    
    let descriptions = `<p>You have a tie between the following archetypes. Each of these roles has its unique strengths, and your results suggest you're a blend of them.</p>`;
    descriptions += '<div>';
    topRoles.forEach(role => {
        descriptions += `
            <div>
                <h3>${resultsData[role].name}</h3>
                <p>${resultsData[role].description}</p>
            </div>
        `;
    });
    descriptions += '</div>';
    resultDescription.innerHTML = descriptions;
}

function displayResult(resultName) {
    let resultType = null;
    for (const key in resultsData) {
        if (resultsData[key].name === resultName) {
            resultType = key;
            break;
        }
    }

    if (!resultType) {
        // Handle case where resultName is not found
        resultTitle.textContent = "Result not found";
        resultDescription.innerHTML = "<p>The result you are looking for does not exist.</p>";
        return;
    }

    resultTitle.textContent = resultsData[resultType].title;
    resultDescription.innerHTML = `<p>${resultsData[resultType].description}</p>`;
}

/*
function calculateAndDisplayResults() {
    // Convert scores object to an array of [role, score] pairs and sort descending
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    const highestScore = sortedScores[0][1];
    const topRoles = sortedScores.filter(score => score[1] === highestScore).map(role => role[0]);

    let resultTitleText;
    let resultDescriptionHTML = '';

    if (topRoles.length === 1) {
        // No tie
        const resultType = topRoles[0];
        resultTitleText = resultsData[resultType].title;
        resultDescriptionHTML = `<p>${resultsData[resultType].description}</p>`;
    } else {
        // It's a tie
        topRoles.sort(); // Sort alphabetically for a canonical display
        const roleNames = topRoles.map(role => resultsData[role].name);
        
        let tiedRolesText = roleNames.join(', ');
        if (roleNames.length > 1) {
            const last = roleNames.pop();
            tiedRolesText = `${roleNames.join(', ')} and ${last}`;
        }

        resultTitleText = `You have a tie between ${tiedRolesText}!`;
        
        let descriptions = `<p>You have a tie between the following archetypes. Each of these roles has its unique strengths, and your results suggest you're a blend of them.</p>`;
        descriptions += '<div>';
        topRoles.forEach(role => {
            descriptions += `
                <div>
                    <h3>${resultsData[role].name}</h3>
                    <p>${resultsData[role].description}</p>
                </div>
            `;
        });
        descriptions += '</div>';
        resultDescriptionHTML = descriptions;
    }

    resultTitle.textContent = resultTitleText;
    resultDescription.innerHTML = resultDescriptionHTML;
}
*/

function showFramework() {
    frameworkModal.showModal();
}

// Define routes with page.js
page('/', showHome);
page('/index', showHome);
page('/quiz', () => page('/quiz/1'));
page('/quiz/:questionIndex', showQuiz);
page('/results/:resultType', showResults);
page('/results', showResults);
page('/framework', showFramework);

// Fallback route for any unrecognized paths
page('*', (ctx) => {
    console.log('Unrecognized route:', ctx.path);
    page('/');
});

async function main() {
    await loadQuizData();
    // Start the router with hash-based routing for GitHub Pages
    page({ hashbang: true });
}

// Quiz state persistence functions
function saveQuizState() {
    const state = {
        currentQuestionIndex,
        scores,
        timestamp: Date.now()
    };
    localStorage.setItem('wardleyQuizState', JSON.stringify(state));
}

function loadQuizState() {
    try {
        const saved = localStorage.getItem('wardleyQuizState');
        if (saved) {
            const state = JSON.parse(saved);
            // Only restore if saved within the last hour
            if (Date.now() - state.timestamp < 3600000) {
                currentQuestionIndex = state.currentQuestionIndex;
                scores = state.scores;
                return true;
            }
        }
    } catch (e) {
        console.warn('Failed to load quiz state:', e);
    }
    return false;
}

function clearQuizState() {
    localStorage.removeItem('wardleyQuizState');
}

function startQuiz() {
    currentQuestionIndex = 0;
    scores = { explorer: 0, villager: 0, townPlanner: 0 };
    clearQuizState(); // Clear any existing saved state
    page('/quiz/1');
}

function restartQuiz() {
    page('/index');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        // Results will be shown by the router when navigating to /results
        return;
    }

    const progressPercentage = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.value = progressPercentage;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    answerOptions.innerHTML = '';
    answerOptions.style.pointerEvents = 'auto'; // Re-enable clicks

    if (questionAnnouncer) {
        questionAnnouncer.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    }

    const shuffledAnswers = [...currentQuestion.answers];
    shuffleArray(shuffledAnswers);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(answer.type);
        answerOptions.appendChild(button);
    });

    // Prepare for slide-in animation
    questionContentWrapper.style.transform = 'translateX(100px)';
    questionContentWrapper.style.opacity = '0';
    
    // Slide-in animation
    anime({
        targets: questionContentWrapper,
        translateX: '0px',
        opacity: 1,
        duration: 75,
        easing: 'easeOutCubic'
    });
}

function selectAnswer(type) {
    scores[type]++;
    answerOptions.style.pointerEvents = 'none';
    
    anime({
        targets: questionContentWrapper,
        translateX: '-100px',
        opacity: 0,
        duration: 75,
        easing: 'easeInCubic',
        complete: () => {
            currentQuestionIndex++;
            saveQuizState(); // Save progress after each answer
            if (currentQuestionIndex >= quizQuestions.length) {
                page('/results');
            } else {
                page(`/quiz/${currentQuestionIndex + 1}`);
            }
        }
    });
}

function showFrameworkModal() {
    page('/framework');
}

function closeFrameworkModal() {
    // Close modal and go back to previous route
    if (frameworkModal.open) {
        frameworkModal.close();
    }
    page.back();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && frameworkModal.open) {
        closeFrameworkModal();
    }
});

main();
