const close_modal = document.querySelector("#close_modal");
const modal = document.querySelector(".modal_container");
const emailForm = document.forms["email_validator"];

emailForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(this);
  if (!emailValidator()) {
    modal.style.visibility = "hidden";
    modal.querySelector("h2").textContent = "Enter a valid email";
  }
});

if (close_modal) {
  close_modal.addEventListener("click", function (e) {
    modal.style.visibility = "hidden";
  });
}

const emailValidator = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
