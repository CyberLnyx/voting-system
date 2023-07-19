const resultContainer = document.querySelector(".result-container");
const loader = document.querySelector(".loader");
const resultCardTemplate = (catogoryname, extras) => {
  return `
  <div class="result-card">
  <div class="category">
    <p class="name">${catogoryname}</p>
  </div>
  <div class="nominees">
  ${extras}
</div>
  </div>
 `;
};
const resultTableTemplate = (rows) => `
<div class="nominees">
<div class="row row-header">
  <p class="nominee-name">Name</p>
  <p class="nominee-score">Votes</p>
</div>
${rows}
</div>
`;
const rowTemplate = (name, votes) => `
<div class="row">
  <p class="nominee-name">${name}</p>
  <p class="nominee-score">${votes}</p>
</div>
`;

const fetchResult = async () => {
  try {
    let response = await fetch("/api/v1/resources/results");
    let jsonResponse = await response.json();
    if (jsonResponse?.success) {
      let data = jsonResponse?.data;
      let contestants = jsonResponse?.contestants;
      let results = [];
      contestants.forEach((category) => {
        let categoryName = category.role;
        let categoryVotes = [];
        category.nominees.forEach((nominee) => {
          let nominee_name = nominee.name;
          let nomineeObj = { nominee_name };
          let count = 0;
          data.forEach((vote) => {
            if (vote[categoryName] && vote[categoryName] === nominee_name) {
              count++;
            }
          });
          nomineeObj.votes = count;
          categoryVotes.push(nomineeObj);
        });
        let categoryResult = { categoryName, categoryVotes };
        results.push(categoryResult);
      });
      results.forEach(({ categoryName, categoryVotes }) => {
        let rows = "";
        categoryVotes.forEach(
          ({ nominee_name, votes }) =>
            (rows += rowTemplate(nominee_name, votes))
        );
        let extras = resultTableTemplate(rows);
        let resultCard = resultCardTemplate(categoryName, extras);
        resultContainer.innerHTML += resultCard;
        loader.style.display = "none";
        resultContainer.style.display = "block";
      });
    }
  } catch (error) {
    console.log("Error", error);
  }
};

fetchResult();
