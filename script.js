console.log("script.js loaded");

let timerId = null;

let birthdayUIInitialized = false;
let secretUnlocked = false;

let countdownEls = {};

function calculateAge() {

    const birthdateInput = document.getElementById("birthdate");
    const input = birthdateInput.value;

    const error = document.getElementById("error");
    
    const resultContainer = document.getElementById("resultcontainer");
    
    const result = document.getElementById("result");
    

    const birthdayContainer = document.getElementById("birthdayContainer");
    
    const birthdayResult = document.getElementById("birthdayResult");

    const today = new Date();

    if (!input) {
        error.innerText = "Please select your birth date";
        resultContainer.style.display = "none";
        birthdayContainer.style.display = "none";
        return;
    }

    const birthdate = new Date(input);

    if (birthdate > today) {
        error.innerText = "Birth date cannot be in the future.";
        resultContainer.style.display = "none";
        birthdayContainer.style.display = "none";
        return;
    }

    error.innerText = "";

    birthdayUIInitialized = false;
    secretUnlocked = false;
    countdownEls = {};

    if (timerId) clearInterval(timerId);

   
    const specialDates = {
        "2004-03-24": {
            message: "💖 This date is very special 💖",
            secret: false
        },
        "2005-02-15": {
            message: " My MINI PENGU was born 🎉💖 ",
            secret: true,
            password: "mini"
        },
        "2019-11-10": {
            message: "🎉 First Day with my baby 🎉",
            secret: true,
            password: "mini"
        },
        "2011-12-17": {
            message: "🌸 A beautiful soul was born 🌸",
            secret: false
        },
        "1976-01-03": {
            message: "⭐ Some dates are simply magical ⭐",
            secret: false
        },
        "2003-06-10": {
            message: "⭐ wish u for the rest of your life ⭐",
            secret: false
        }
    };

    function updateAge() {
        const now = new Date();

        
        let years = now.getFullYear() - birthdate.getFullYear();
        let months = now.getMonth() - birthdate.getMonth();
        let days = now.getDate() - birthdate.getDate();

        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        
        const ageMs = now - birthdate;
        const ageSeconds = Math.floor(ageMs / 1000);
        const ageMinutes = Math.floor(ageSeconds / 60);
        const ageHours = Math.floor(ageMinutes / 60);
        const ageDays = Math.floor(ageHours / 24);
        const ageWeeks = Math.floor(ageDays / 7);

        
        let nextBirthday = new Date(
            now.getFullYear(),
            birthdate.getMonth(),
            birthdate.getDate()
        );

        if (nextBirthday < now) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        const diff = nextBirthday - now;

        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutesLeft = Math.floor((diff / (1000 * 60)) % 60);
        const secondsLeft = Math.floor((diff / 1000) % 60);

       
        if (!birthdayUIInitialized) {
            birthdayUIInitialized = true;

            let specialHTML = "";

            if (specialDates[input]) {
                const data = specialDates[input];

                if (!data.secret) {
                    specialHTML = `
                        <div style="text-align:center; margin-bottom:12px; font-size:18px; font-weight:600;">
                            ${data.message}
                        </div>
                    `;
                } else {
                    specialHTML = `
                        <div id="secretBox" style="text-align:center; margin-bottom:12px;">
                            <p style="font-weight:600;">🔒 Enter password to reveal secret</p>
                            <input
                                type="password"
                                id="secretPassword"
                                placeholder="Enter password"
                                style="padding:6px; width:70%; margin-top:6px;"
                            />
                            <br>
                            <button id="unlockBtn" style="margin-top:8px;">Unlock</button>
                            <p id="secretError" style="color:red; margin-top:6px;"></p>
                        </div>
                    `;
                }
            }

            birthdayResult.innerHTML = `
                ${specialHTML}
                <div class="bday-item"><h4>Days</h4><p id="bdDays"></p></div>
                <div class="bday-item"><h4>Hours</h4><p id="bdHours"></p></div>
                <div class="bday-item"><h4>Minutes</h4><p id="bdMinutes"></p></div>
                <div class="bday-item"><h4>Seconds</h4><p id="bdSeconds"></p></div>
            `;

            countdownEls = {
                days: document.getElementById("bdDays"),
                hours: document.getElementById("bdHours"),
                minutes: document.getElementById("bdMinutes"),
                seconds: document.getElementById("bdSeconds")
            };

            if (specialDates[input] && specialDates[input].secret) {
                const btn = document.getElementById("unlockBtn");
                if (btn) {
                    btn.onclick = () => {
                        const entered = document.getElementById("secretPassword").value;
                        const errorText = document.getElementById("secretError");

                        if (entered === specialDates[input].password) {
                            secretUnlocked = true;

                           
                            const secretBox = document.getElementById("secretBox");
                            if (secretBox) {
                                secretBox.innerHTML = `
                                    <div style="font-size:18px; font-weight:600;">
                                        ${specialDates[input].message}
                                    </div>
                                `;
                            }
                        } else {
                            errorText.innerText = "❌ Incorrect password";
                        }
                    };
                }
            }
        }

       
        countdownEls.days.textContent = daysLeft;
        countdownEls.hours.textContent = hoursLeft;
        countdownEls.minutes.textContent = minutesLeft;
        countdownEls.seconds.textContent = secondsLeft;

      
        result.innerHTML = `
            <div class="result-item"><h3>Age</h3><p>${years} Years ${months} Months ${days} Days</p></div>
            <div class="result-item"><h3>Weeks Passed</h3><p>${ageWeeks}</p></div>
            <div class="result-item"><h3>Days Passed</h3><p>${ageDays}</p></div>
            <div class="result-item"><h3>Hours Passed</h3><p>${ageHours}</p></div>
            <div class="result-item"><h3>Minutes Passed</h3><p>${ageMinutes}</p></div>
            <div class="result-item"><h3>Seconds Passed</h3><p>${ageSeconds}</p></div>
        `;

        resultContainer.style.display = "block";
        birthdayContainer.style.display = "block";
    }

    updateAge();
    timerId = setInterval(updateAge, 1000);
}


document.getElementById("agecalculator").addEventListener("submit", (e) => {
    e.preventDefault();
    calculateAge();
});

