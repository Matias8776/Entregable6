const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("api/sessions/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then( async (response) => {
        const errorElement = document.getElementById("error");
        if (response.status === 200) {
            loginForm.reset();
            window.location.replace("/products");
            errorElement.textContent = "";
        } else {
            const errorData = await response.json();
            errorElement.textContent = errorData.message;
        }
    });
});
