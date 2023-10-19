const root = $('#root')

//Adding of filter for specific jobs
var filter_bar = $("#filter_bar"),
    filters_are = $(".filters");
var filters = [];//array where Filter terms will be stored
var data = [];
var originalData = [];



$(document).ready(function (){

    $.getJSON("data.json", function (loadedData){
      data = loadedData;
      originalData = [...loadedData]
      getJobs(data);
    })
    
      // Add a button to open the pop-up for adding a new job
      const addButton = $("<button id='addJobButton'>Add (+)</button>");
      addButton.click(openAddJobPopup); // Call the openAddJobPopup function when clicked
      $("body").append(addButton);
    
      // Rest of your existing code...
    });
    
   
$("#clearFilters").click(clearFilters);


function clearFilters() {
  filters = []; // Clear the filters array
  filters_are.empty(); // Clear the filter items in the UI
  filter_bar.css("display", "none"); // Hide the filter bar
  updateJobListings(); // Refresh the job listings
}


    

    function AddFilter(filter_name) {
      filter_bar.css("display", "flex");
    
      if (!filters.includes(filter_name)) {
        filters.push(filter_name);
    
        console.log(filters);
    
        const escapedFilterName = filter_name.replace(/\s+/g, "-").toLowerCase();
    
        filters_are.append(
          `<li class="${escapedFilterName}">
            ${filter_name}
            <button class="close_btn" onclick="RemoveFilter('${escapedFilterName}')">
              <img src="images/icon-remove.svg" alt="remove filter">
            </button>
          </li>`
        );
      } else {
        alert(filter_name + " is already added to the filter");
      }
    
      const filter_array = originalData.filter((job) =>
        filters.every((filter) => {
          return (
            job.role === filter ||
            job.level === filter ||
            job.languages.includes(filter) ||
            job.tools.includes(filter)
          );
        })
      );

      $.getJSON("data.json", function (loadedData) {
        data = loadedData;
        updateJobListings(); // Update job listings with the new set of filters
      });
    
      root.empty();
      console.log(filter_array);
    
      getJobs(filter_array);
    }
    


    function RemoveFilter(filter_name) {
      console.log(`Removing filter: ${filter_name}`);
      const escapedFilterName = filter_name.replace(/\s+/g, "-").toLowerCase();
      const filterItem = $(`.${escapedFilterName}`);
      filterItem.remove();
      $.getJSON("data.json", function (loadedData) {
        data = loadedData;
        updateJobListings(); // Update job listings with the new set of filters
      });
      const index = filters.indexOf(filter_name);
      if (index !== -1) {
        filters.splice(index, 1);
      }
    
      if (filters.length === 0) {
        root.empty();
        getJobs(originalData);
      } else {
        updateJobListings();
      }
    }
    




function updateJobListings() {
  // If there are no filters selected, load all jobs
  if (filters.length === 0) {
    root.empty(); // Clear the existing job listings
    getJobs(data); // Load all jobs
    return; // Exit the function
  }

  // Fetch and filter job listings based on the selected filters
  const filter_array = data.filter(job =>
    filters.every(filter => {
      return (
        job.role === filter ||
        job.level === filter ||
        job.languages.includes(filter) ||
        job.tools.includes(filter)
      );
    })
  );

  // Clear the existing job listings on the page
  root.empty();

  // Render the filtered job listings
  getJobs(filter_array);
}




function getJobs(jobs) {
  $.each(jobs, function (index, job) {
      const existingCard = $(".job_card").filter(function () {
          return $(this).find(".company").text() === job.company;
      });

      // If the job card already exists, skip it
      if (existingCard.length === 0) {
        let card = `
        <div>
          <div class='job_card active'>
            <div class='part_1'>
              <div class='logo_part'>
                <img src='${job.logo}' alt='company logo'>
              </div>
              <div class='info_part'>
                <div>
                  <h1 class='company'>${job.company}</h1>
                  <p class='new'>${job.new}</p>
                  <p class='featured'>${job.company}</p>
                </div>
                <div>
                  <p class='position clickable' data-index="${index}">${job.position}</p>
                </div>
                <div>
                  <ul>
                    <li>${job.postedAt}</li>
                    <li>.</li>
                    <li>${job.contract}</li>
                    <li>.</li>
                    <li>${job.location}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="part_2">
              <ul class="filters details">
                <li><button class="btn role" onclick="AddFilter(this.innerText)">${job.role}</button></li>
                <li><button class="btn level" onclick="AddFilter(this.innerText)">${job.level}</button></li>
                ${job.languages.map(val => `<li><button class="btn language" onclick="AddFilter('${val}')">${val}</button></li>`).join(' ')}
                ${job.tools.map(val => `<li><button class="btn tool" onclick="AddFilter('${val}')">${val}</button></li>`).join(' ')}
                <li><button class="btn delete" data-index="${index}">&#128465;</button></li>
              </ul>
            </div>
          </div>
        </div>`;

        console.log($(".btn.delete").length); // Check how many elements are selected
          root.append(card);
      }
  });

  // Handle click events on job titles and delete buttons
  $(".position.clickable").click(function () {
    const index = $(this).data("index");
    openJobDetailsPopup(jobs[index]);
  });

  $(".btn.delete").click(function () {
    const index = $(this).data("index");
    deleteJob(index);
  });

  


}

function openJobDetailsPopup(job) {
  const popup = $("<div class='popup'></div>");
  const popupContent = $("<div class='popup-content'></div>");
  popupContent.append("<span class='close-button'>&times;</span>");
  popupContent.append("<h2>Job Details</h2>");

  const details = `
    <p><strong>Company:</strong> ${job.company}</p>
    <p><strong>Position:</strong> ${job.position}</p>
    <p><strong>Role:</strong> ${job.role}</p>
    <p><strong>Level:</strong> ${job.level}</p>
    <p><strong>Languages:</strong> ${job.languages.join(', ')}</p>
    <p><strong>Tools:</strong> ${job.tools.join(', ')}</p>
    <p><strong>New Job:</strong> ${job.new ? 'Yes' : 'No'}</p>
  `;

  popupContent.append(details);
  popup.append(popupContent);
  $("body").append(popup);

  // Attach the click event handler to the close button
  popup.find(".close-button").click(function () {
    popup.remove();
  });
}
function deleteJob(index) {
  // Find the job card to be removed
  const jobCard = $(`.job_card[data-index="${index}"]`);

  // Remove the job card
  jobCard.remove();

  // After removing the job card, you should also update the `data` and `originalData` arrays
  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    originalData = [...data]; // Update originalData to reflect the changes
  }
  updateJobListings(); // Refresh the job listings
}






$(document).on("click", ".btn.delete", function () {
  console.log("Delete button clicked");
  const index = $(this).data("index");
  deleteJob(index);
});



function openAddJobPopup() {
  const popup = $("<div id='addJobPopup' class='popup'></div>");

  const form = $("<form></form>");
  form.append("<h2>Add a New Job</h2>");

  form.append("<label for='company'>Company:</label>");
  form.append("<input type='text' id='company' required>");

  form.append("<label for='position'>Position:</label>");
  form.append("<input type='text' id='position' required>");

  form.append("<label for='role'>Role:</label>");
  form.append("<input type='text' id='role' required>");

  form.append("<label for='level'>Level:</label>");
  form.append("<input type='text' id='level' required>");

  form.append("<label for='languages'>Languages (comma-separated):</label>");
  form.append("<input type='text' id='languages' required>");

  form.append("<label for='tools'>Tools (comma-separated):</label>");
  form.append("<input type='text' id='tools' required>");

  form.append("<label for='new'>New Job:</label>");
  form.append("<input type='checkbox' id='new'>");

  form.append("<button type='submit'>Add Job</button>");
  form.append("<button type='button' id='cancelButton'>Cancel</button>");

  form.on("submit", function (event) {
    event.preventDefault();

    // Get values from form inputs
    const company = $("#company").val();
    const position = $("#position").val();
    const role = $("#role").val();
    const level = $("#level").val();
    const languages = $("#languages").val().split(",").map((language) => language.trim());
    const tools = $("#tools").val().split(",").map((tool) => tool.trim());
    const newJob = $("#new").prop("checked");

    // Add validations as needed
    if (!company || !position || !role || !level || !languages.length || !tools.length) {
      alert("Please fill in all required fields (Company, Position, Role, Level, Languages, and Tools).");
      return;
    }

    function RemoveAll() {
      // Clear the filters array
      filters = [];
    
      // Hide the filter bar
      filter_bar.css("display", "none");
    
      // Clear the filter items in the UI
      filters_are.empty();
    
      // Refresh the job listings
      updateJobListings();
    }
    

    // Create a new job object based on user input
    const newJobObject = {
      company: company,
      position: position,
      role: role,
      level: level,
      languages: languages,
      tools: tools,
      new: newJob,
    };

    // Add the new job to the data array
    data.push(newJobObject);

    // Close the pop-up
    popup.remove();

    // Update the job listings with the new data
    updateJobListings();

    // Save the updated data to data.json
    saveDataToFile(data);
  });

  popup.append(form);
  $("body").append(popup);

  // Clicking the "Cancel" button hides the form
  $("#cancelButton").click(function () {
    popup.remove();
  });
}

function saveDataToFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string with pretty formatting

  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create a hidden <a> element using jQuery and trigger a click event to download the JSON file
  const $a = $('<a>', {
    href: url,
    download: 'data.json'
  }).appendTo('body');
  $a[0].click(); // Trigger the click event on the first (and only) element in the jQuery collection

  // Clean up by revoking the object URL and removing the <a> element
  URL.revokeObjectURL(url);
  $a.remove();
}
