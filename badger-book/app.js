function buildStudents(studs) {
  document.getElementById("num-results").innerText = studs.length;
  let studentSection = document.getElementById("students");
  studentSection.innerHTML = "";

  for (let student of studs) {
    let first = student.name.first;
    let lastname = student.name.last;
    let major = student.major;
    let numOfCred = student.numCredits;
    let fromWis = student.fromWisconsin;
    let interest = student.interests;

    let studentContainer = document.createElement("div");
    studentContainer.className =
      "col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12";

    // First and Lastname
    let studentNode = document.createElement("h1");
    studentNode.className = "first_last";
    studentNode.innerText = `${first} ${lastname}`;
    studentContainer.appendChild(studentNode);

    // Major
    let studentMajorNode = document.createElement("h4");
    studentMajorNode.className = "major";
    studentMajorNode.innerText = `Major: ${major}`;
    studentContainer.appendChild(studentMajorNode);

    // credits and fromWisc?
    let statement = fromWis ? "is from Wisconsin" : "is not from Wisconsin";
    let studentNumOfCredNode = document.createElement("p");
    studentNumOfCredNode.className = "num_cred";
    studentNumOfCredNode.innerText = `${first} is taking ${numOfCred} credits and ${statement}.`;
    studentContainer.appendChild(studentNumOfCredNode);

    // Interests
    let studentInterestNode = document.createElement("p");
    studentInterestNode.className = "interest";
    studentInterestNode.innerText = `They have ${interest.length} interests including:`;
    studentContainer.appendChild(studentInterestNode);

    let studentInterestList = document.createElement("ul");
    for (let studentItem of interest) {
      let item = document.createElement("li");
      let link = document.createElement("a");
      link.innerText = studentItem;

      item.appendChild(link);
      studentInterestList.appendChild(item);
    }
    studentContainer.appendChild(studentInterestList);

    studentSection.appendChild(studentContainer);
  }

  getInterestItems();
}

function handleSearch(e) {
  e?.preventDefault();

  let searchName = document
    .getElementById("search-name")
    .value.trim()
    .toLowerCase();
  let searchMajor = document
    .getElementById("search-major")
    .value.trim()
    .toLowerCase();
  let searchInterest = document
    .getElementById("search-interest")
    .value.trim()
    .toLowerCase();

  let studentFilteredData = studentData.filter((student) => {
    let fullname = `${student.name.first} ${student.name.last}`.toLowerCase();
    let major = student.major.toLowerCase();
    let interest = student.interests.some((value) =>
      value.toLowerCase().includes(searchInterest)
    );
    return (
      (searchName === "" || fullname.includes(searchName)) &&
      (searchMajor === "" || major.includes(searchMajor)) &&
      (searchInterest === "" || interest)
    );
  });

  buildStudents(studentFilteredData);
}

function getInterestItems() {
  const interestItemAnchorHTML = document.querySelectorAll("a");

  for (let i = 0; i < interestItemAnchorHTML.length; i++) {
    interestItemAnchorHTML[i].addEventListener("click", (e) => {
      document.getElementById("search-major").value = "";
      document.getElementById("search-name").value = "";
      const selectedText = e.target.innerText;

      document.getElementById("search-interest").value = selectedText;
      handleSearch(e);
    });
  }
}

fetch("https://cs571api.cs.wisc.edu/rest/s25/hw2/students", {
  headers: {
    "X-CS571-ID": CS571.getBadgerId(),
  },
})
  .then((response) => response.json())
  .then((data) => {
    studentData = data;
    buildStudents(data); // Initial population of students
  })
  .catch((err) => {
    console.log(err);
  });

document.getElementById("search-btn").addEventListener("click", handleSearch);
