const root = $('#root')

//Adding of filter for specific jobs
var filter_bar = $("#filter_bar"),
    filters_are = $(".filters");
let filters = [];//array where Filter terms will be stored

$(document).ready(function (){

    $.getJSON("data.json", function (data){
        getJobs(data)
    })

})

function AddFilter(filter_name) {
    filter_bar.css("display", "flex");

    if(filters.includes(filter_name) === false){//Prevent user from clicking same item for filter

        filters.push(filter_name);

        console.log(filters)

        filters_are.append(
            `<li class="`+ filter_name +`">`+ filter_name +` 
                <button class="close_btn" onclick="RemoveFilter(this)">
                    <img src="images/icon-remove.svg" alt="remove filter">
                </button>
            </li>`)

    }else{

        alert(filter_name + " is already added to the filter");

    }

    $.getJSON("data.json", function (data){

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
          
        root.empty()
        console.log(filter_array)

        getJobs(filter_array)

        //To make the new and the featured term not to be displayed if it is false
        const _new = $(".new"),
            featured = $(".featured"),
            job_card = $(".job_card");


        $.each(job_card, function (i, val){
            if (_new[i].textContent === 'false') {
                $(_new[i]).css('display', 'none')
            }

            if(featured[i].textContent === "false"){
                featured[i].css('display', 'none');
                job_card[i].removeClass("active");
            }
        })

    })

    console.log(filter_name)
}

function RemoveFilter (filter_array) {
    console.log(filter_array)
}


function getJobs (jobs) {
    $.each(jobs, function (index, job){

        let card =
            "<div>" +
            "<div class='job_card active'>" +
            "<div class='part_1'>" +
            "<div class='logo_part'>" +
            "<img src='"+ job.logo +"' alt='company logo'>" +
            "</div>" +
            "<div class='info_part'>" +
            "<div>" +
            "<h1 class='company'>"+ job.company +"</h1>" +
            "<p class='new'>"+ job.new +"</p>" +
            "<p class='featured'>"+ job.company +"</p>" +
            "</div>" +
            "<div>" +
            "<p class='position'>"+ job.position +"</p>" +
            "</div>" +
            `<div>
                                  <ul>
                                    <li>`+ job.postedAt +`</li>
                                    <li>.</li>
                                    <li>`+ job.contract +`</li>
                                    <li>.</li>
                                    <li>`+ job.location +`</li>
                                  </ul>
                                </div>` +
            "</div>" +
            "</div>" +
            `<div class="part_2">
                          <ul class="filters details">
                            <li><button class="btn" onclick="AddFilter(this.innerText)">`+ job.role +`</button></li>
                            <li><button class="btn" onclick="AddFilter(this.innerText)">`+ job.level +`</button></li>
                            `+ $.map(job.languages, function (val, i){
                return ("<li><button class='btn' onclick='AddFilter(this.innerText)'>"+ val +"</button></li>")
            }).join(" ") +`
                            `+ $.map(job.tools, function (val, i){
                return ("<li><button class='btn' onclick='AddFilter(this.innerText)'>"+ val +"</button></li>")
            }).join(" ") +`
                          </ul>
                        </div>` +
            "</div>" +
            "</div>"

        root.append(card)
    })
}