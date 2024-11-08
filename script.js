let selectedFilters = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(response => response.json())
    .then(data => renderListings(data));
});

function renderListings(jobs) {
  const jobContainer = document.getElementById("job-cards-container");
  jobContainer.innerHTML = ""; 

  jobs.forEach(job => {
    const jobCard = document.createElement("div");
    jobCard.className = "job-listing";

    if (job.featured) {
      jobCard.classList.add("highlighted-listing"); 
    }

    const logo = document.createElement("img");
    logo.src = job.logo;
    logo.alt = `${job.company} logo`;
    jobCard.appendChild(logo);

    const jobInfo = document.createElement("div");
    jobInfo.className = "listing-details";

    const companyDetails = document.createElement("div");
    companyDetails.className = "company-details";

    const companyName = document.createElement("div");
    companyName.className = "company-name";
    companyName.textContent = job.company;
    companyDetails.appendChild(companyName);

    const badges = document.createElement("div");
    badges.className = "label-container";

    if (job.new) {
      const newBadge = document.createElement("span");
      newBadge.className = "new-listing";
      newBadge.textContent = "NEW!";
      badges.appendChild(newBadge);
    }

    if (job.featured) {
      const featuredBadge = document.createElement("span");
      featuredBadge.className = "featured-listing";
      featuredBadge.textContent = "FEATURED";
      badges.appendChild(featuredBadge);
    }

    companyDetails.appendChild(badges);
    jobInfo.appendChild(companyDetails);

    const title = document.createElement("h2");
    title.textContent = job.position;
    jobInfo.appendChild(title);

    const details = document.createElement("p");
    details.textContent = `${job.postedAt} • ${job.contract} • ${job.location}`;
    jobInfo.appendChild(details);

    const techTags = document.createElement("div");
    techTags.className = "tag-container";

    // Function to create a skill tag with click event
    function createSkillTag(text) {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.textContent = text;
      tag.addEventListener("click", () => toggleFilter(text));
      return tag;
    }

    techTags.appendChild(createSkillTag(job.role));
    techTags.appendChild(createSkillTag(job.level));

    job.languages.forEach(language => {
      techTags.appendChild(createSkillTag(language));
    });

    job.tools.forEach(tool => {
      techTags.appendChild(createSkillTag(tool));
    });

    jobCard.appendChild(jobInfo);
    jobCard.appendChild(techTags);
    jobContainer.appendChild(jobCard);
  });
}

// Function to toggle filter selection
function toggleFilter(filter) {
  if (selectedFilters.includes(filter)) {
    selectedFilters = selectedFilters.filter(item => item !== filter);
  } else {
    selectedFilters.push(filter);
  }
  updateFilterBar();
  filterJobs();
}

// Function to update the filter bar display
function updateFilterBar() {
  const filterBar = document.getElementById("filter-bar");
  const filterSection = document.getElementById("filter-section");

  filterSection.innerHTML = "";
  selectedFilters.forEach(filter => {
    const filterTag = document.createElement("span");
    filterTag.className = "selected-filter";
    filterTag.textContent = filter;

    const removeButton = document.createElement("span");
    removeButton.className = "remove-selected-filter";
    removeButton.textContent = "✖";
    removeButton.addEventListener("click", () => toggleFilter(filter));

    filterTag.appendChild(removeButton);
    filterSection.appendChild(filterTag);
  });

  filterBar.style.display = selectedFilters.length > 0 ? "flex" : "none";
}

// Function to filter and render jobs based on selected filters
function filterJobs() {
  fetch("data.json")
    .then(response => response.json())
    .then(jobs => {
      const filteredJobs = jobs.filter(job => {
        const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
        return selectedFilters.every(filter => jobTags.includes(filter));
      });
      renderListings(filteredJobs);
    });
}

// Event listener for "Clear" button
document.getElementById("clear-all").addEventListener("click", () => {
  selectedFilters = [];
  updateFilterBar();
  filterJobs();
});
