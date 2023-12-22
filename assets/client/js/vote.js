const edit_matric_no = document.querySelector("#edit_matric_no");
const votingForm = document.forms["voting_form"];
const allSelectList = document.querySelectorAll("select");
const processor = document.querySelector(".processor");
const modal = document.querySelector(".modal_container");
const vote_modal = document.querySelector(".vote_modal_container");
const close_modal = document.querySelector("#close_modal");
const close_vote_modal = document.querySelector("#close_vote_modal");
const confirm_votes_container = document.querySelector(".votes");
const submit_final_vote = document.querySelector("#submit_final_vote");
const success_container = document.querySelector(".success_container");
const error_container = document.querySelector(".error_container");
const close_error_modal = document.querySelector(".close_error_modal");

let newVote;

edit_matric_no.addEventListener("click", function () {
  location.replace("/");
});

votingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const matricNo = document.querySelector("#hidden").textContent;
  newVote = { voterMatricNo: matricNo };
  allSelectList.forEach((select) => {
    if (select.value !== "none") {
      newVote[select.name] = select.value;
    }
  });

  // check  if the user actually voted
  let totalVote = [];
  for (let keys in newVote) {
    totalVote.push(keys);
  }

  if (totalVote.length < 2) {
    modal.style.visibility = "visible";
    return;
  }

  // if they voted ask them to confirm it
  vote_modal.style.visibility = "visible";
  confirm_votes_container.innerHTML = `<h4 id="confirm_vote_matric_no">Your Matric No: ${newVote.voterMatricNo}</h4>`;
  for (let keys in newVote) {
    if (keys !== "voterMatricNo") {
      confirm_votes_container.innerHTML += `<p id="wrapless"><b>${keys.toUpperCase()}</b> : ${
        newVote[keys]
      }`;
    }
  }
});

close_modal.addEventListener("click", function (e) {
  modal.style.visibility = "hidden";
});

close_vote_modal.addEventListener("click", function (e) {
  vote_modal.style.visibility = "hidden";
});

submit_final_vote.addEventListener("click", function () {
  vote_modal.style.visibility = "hidden";
  processor.style.visibility = "visible";
  handleSubmit();
});

const submitFinalVote = () => {
  error_container.style.visibility = "hidden";
  processor.style.visibility = "visible";
  handleSubmit();
};

const handleSubmit = async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newVote),
  };

  const url = location.href + "/validate";

  const res = await fetch(url, options);
  const mess = await res.json();
  if (mess.success) {
    setTimeout(handleSuccess, 3000);
  } else {
    setTimeout(handleError, 2000);
  }
};

const handleSuccess = () => {
  processor.style.visibility = "hidden";
  success_container.style.visibility = "visible";
  location.replace("/");
};

const handleError = () => {
  processor.style.visibility = "hidden";
  error_container.style.visibility = "visible";
};

close_error_modal.addEventListener("click", submitFinalVote);
