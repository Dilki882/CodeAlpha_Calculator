/* =====================================
   CALCPRO CALCULATOR
===================================== */


const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const keypad =
    document.querySelector(".keypad");

const copyBtn =
    document.getElementById("copyBtn");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const historyList =
    document.getElementById("historyList");

const clearHistory =
    document.getElementById("clearHistory");

const clearHistoryText =
    document.getElementById("clearHistoryText");


/* =====================================
   VARIABLES
===================================== */

let currentValue = "0";

let previousValue = "";

let operator = null;

let shouldResetDisplay = false;

let history =
    JSON.parse(
        localStorage.getItem("calcHistory")
    ) || [];


/* =====================================
   DISPLAY
===================================== */

function updateDisplay() {

    currentDisplay.textContent =
        formatNumber(currentValue);

}


/* =====================================
   NUMBER FORMAT
===================================== */

function formatNumber(value) {

    if (value === "Error") {
        return value;
    }

    if (value === "") {
        return "0";
    }

    const parts = value.split(".");

    let integerPart = parts[0];

    const decimalPart =
        parts.length > 1
            ? "." + parts[1]
            : "";

    if (
        integerPart === "-" ||
        integerPart === ""
    ) {
        return value;
    }

    const number =
        Number(integerPart);

    if (
        Number.isNaN(number)
    ) {
        return value;
    }

    return (
        number.toLocaleString(
            "en-US"
        ) + decimalPart
    );
}


/* =====================================
   INPUT NUMBER
===================================== */

function inputNumber(number) {

    if (
        currentValue === "Error" ||
        shouldResetDisplay
    ) {

        currentValue = number;

        shouldResetDisplay = false;

    } else {

        if (
            currentValue === "0"
        ) {

            currentValue = number;

        } else {

            currentValue += number;

        }

    }

    updateDisplay();
}


/* =====================================
   DECIMAL
===================================== */

function inputDecimal() {

    if (
        currentValue === "Error" ||
        shouldResetDisplay
    ) {

        currentValue = "0.";

        shouldResetDisplay = false;

        updateDisplay();

        return;
    }


    if (
        !currentValue.includes(".")
    ) {

        currentValue += ".";

        updateDisplay();

    }
}


/* =====================================
   OPERATOR
===================================== */

function chooseOperator(nextOperator) {

    if (
        currentValue === "Error"
    ) {
        return;
    }


    if (
        operator !== null &&
        !shouldResetDisplay
    ) {

        calculate();

    }


    previousValue = currentValue;

    operator = nextOperator;

    shouldResetDisplay = true;


    previousDisplay.textContent =
        `${formatNumber(previousValue)}
        ${displayOperator(operator)}`;

}


/* =====================================
   OPERATOR DISPLAY
===================================== */

function displayOperator(op) {

    const operators = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return operators[op] || op;
}


/* =====================================
   CALCULATE
===================================== */

function calculate() {

    if (
        operator === null ||
        previousValue === ""
    ) {
        return;
    }


    const first =
        parseFloat(previousValue);

    const second =
        parseFloat(currentValue);


    let result;


    switch (operator) {

        case "+":

            result = first + second;

            break;


        case "-":

            result = first - second;

            break;


        case "*":

            result = first * second;

            break;


        case "/":

            if (second === 0) {

                showError(
                    "Cannot divide by zero"
                );

                return;
            }

            result = first / second;

            break;


        case "%":

            result =
                first % second;

            break;


        default:

            return;
    }


    if (
        !Number.isFinite(result)
    ) {

        showError("Invalid calculation");

        return;

    }


    result =
        parseFloat(
            result.toFixed(10)
        ).toString();


    const expression =
        `${formatNumber(previousValue)}
        ${displayOperator(operator)}
        ${formatNumber(currentValue)}`;


    addHistory(
        expression,
        result
    );


    previousDisplay.textContent =
        `${expression} =`;


    currentValue = result;

    previousValue = "";

    operator = null;

    shouldResetDisplay = true;


    updateDisplay();

}


/* =====================================
   CLEAR
===================================== */

function clearCalculator() {

    currentValue = "0";

    previousValue = "";

    operator = null;

    shouldResetDisplay = false;

    previousDisplay.textContent =
        "Ready to calculate";

    updateDisplay();
}


/* =====================================
   BACKSPACE
===================================== */

function backspace() {

    if (
        shouldResetDisplay ||
        currentValue === "Error"
    ) {
        return;
    }


    if (
        currentValue.length <= 1
    ) {

        currentValue = "0";

    } else {

        currentValue =
            currentValue.slice(0, -1);

    }


    updateDisplay();
}


/* =====================================
   TOGGLE SIGN
===================================== */

function toggleSign() {

    if (
        currentValue === "0" ||
        currentValue === "Error"
    ) {
        return;
    }


    if (
        currentValue.startsWith("-")
    ) {

        currentValue =
            currentValue.substring(1);

    } else {

        currentValue =
            "-" + currentValue;

    }


    updateDisplay();
}


/* =====================================
   ERROR
===================================== */

function showError(message) {

    currentValue = "Error";

    previousDisplay.textContent =
        message;

    shouldResetDisplay = true;

    updateDisplay();

}


/* =====================================
   BUTTON CLICK
===================================== */

keypad.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(".key");


        if (!button) {
            return;
        }


        const value =
            button.dataset.value;

        const action =
            button.dataset.action;


        if (value) {

            if (
                !isNaN(value)
            ) {

                inputNumber(value);

            }

            else if (
                value === "."
            ) {

                inputDecimal();

            }

            else {

                chooseOperator(value);

            }

        }


        if (action) {

            switch (action) {

                case "clear":

                    clearCalculator();

                    break;


                case "backspace":

                    backspace();

                    break;


                case "toggle-sign":

                    toggleSign();

                    break;


                case "calculate":

                    calculate();

                    break;

            }

        }

    }
);


/* =====================================
   KEYBOARD SUPPORT
===================================== */

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        /* Numbers */

        if (
            /^[0-9]$/.test(key)
        ) {

            inputNumber(key);

            animateKey(key);

            return;
        }


        /* Decimal */

        if (
            key === "."
        ) {

            inputDecimal();

            return;
        }


        /* Operators */

        if (
            ["+", "-", "*", "/"].includes(key)
        ) {

            chooseOperator(key);

            return;
        }


        /* Enter */

        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

            return;
        }


        /* Backspace */

        if (
            key === "Backspace"
        ) {

            backspace();

            return;
        }


        /* Escape */

        if (
            key === "Escape"
        ) {

            clearCalculator();

            return;
        }


        /* Percentage */

        if (
            key === "%"
        ) {

            chooseOperator("%");

        }

    }
);


/* =====================================
   KEY ANIMATION
===================================== */

function animateKey(key) {

    const button =
        document.querySelector(
            `.key[data-value="${key}"]`
        );


    if (!button) {
        return;
    }


    button.classList.add("pressed");


    setTimeout(
        () => {
            button.classList.remove("pressed");
        },
        100
    );
}


/* =====================================
   HISTORY
===================================== */

function addHistory(
    expression,
    result
) {

    const item = {

        expression: expression,

        result: result,

        time:
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )

    };


    history.unshift(item);


    if (
        history.length > 8
    ) {

        history.pop();

    }


    localStorage.setItem(
        "calcHistory",
        JSON.stringify(history)
    );


    renderHistory();
}


/* =====================================
   RENDER HISTORY
===================================== */

function renderHistory() {

    if (
        history.length === 0
    ) {

        historyList.innerHTML = `

            <div class="empty-history">

                <i class="fa-regular fa-clock"></i>

                <p>
                    No calculations yet
                </p>

                <span>
                    Your recent calculations
                    will appear here
                </span>

            </div>

        `;

        return;
    }


    historyList.innerHTML =
        history.map(
            item => `

                <div class="history-item">

                    <div>

                        <div class="history-expression">
                            ${item.expression}
                        </div>

                        <div class="history-result">
                            = ${formatNumber(item.result)}
                        </div>

                    </div>

                    <div class="history-time">
                        ${item.time}
                    </div>

                </div>

            `
        ).join("");

}


/* =====================================
   CLEAR HISTORY
===================================== */

function removeHistory() {

    history = [];

    localStorage.removeItem(
        "calcHistory"
    );

    renderHistory();

    showToast(
        "History cleared"
    );

}


clearHistory.addEventListener(
    "click",
    removeHistory
);


clearHistoryText.addEventListener(
    "click",
    removeHistory
);


/* =====================================
   COPY RESULT
===================================== */

copyBtn.addEventListener(
    "click",
    async function() {

        if (
            currentValue === "Error"
        ) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                currentValue
            );

            showToast(
                "Result copied!"
            );

        } catch {

            showToast(
                "Copy failed"
            );

        }

    }
);


/* =====================================
   TOAST
===================================== */

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2000
        );

}


/* =====================================
   LOAD HISTORY
===================================== */

renderHistory();

updateDisplay();