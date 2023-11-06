
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("client-form");
    const submitButton = document.getElementById("submit-button");
    submitButton.setAttribute("disabled", "disabled");
    const formFields = form.querySelectorAll("input");
    // Función para verificar si todos los campos están llenos
    function checkFormFields() {
        let allFieldsFilled = true;
        formFields.forEach(function(field) {
            if (field.value === "") {
                allFieldsFilled = false;
            }
        });

        if (allFieldsFilled) {
            submitButton.removeAttribute("disabled");
        } else {
            submitButton.setAttribute("disabled", "disabled");
        }
    }

    // Agregar un evento de escucha a cada campo del formulario
    formFields.forEach(function(field) {
        field.addEventListener("input", checkFormFields);
    });
});