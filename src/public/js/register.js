const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (response) => {
        const errorElement = document.getElementById("error");
        if (response.status === 200) {
            registerForm.reset();
            window.location.replace("/");
            errorElement.textContent = "";
        } else {
            const errorData = await response.json();
            errorElement.textContent = errorData.message;
        }
    });
});
