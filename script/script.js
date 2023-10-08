$(document).ready(function (){
    const root = $('#root')

    $.getJSON("data.json", function (data){
        $.each(data, function (index, job){
            console.log(job)
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
                            <li><button class="btn" onclick="AddFilter(this)">`+ job.role +`</button></li>
                            <li><button class="btn" onclick="AddFilter(this)">`+ job.level +`</button></li>
                            `+ $.map(job.languages, function (val, i){
                                return ("<li><button class='btn'>"+ val +"</button></li>")
                            }).join(" ") +`
                          </ul>
                        </div>` +
                    "</div>" +
                "</div>"

            $(root).append(card)
        })
    })
})