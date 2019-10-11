g.autoComplete = function(){

    function renderAutoComplete(holder,data, notifyParam){
        holder.autocomplete({
            source: data,
            minLength: 1,
            response: function(event, ui) {
                $(".autocomplete-loader").addClass("hide");
                if(ui.content.length < 1){
                    renderNoMatchAutocomplete(holder);
                }
            },
            select: function (event, ui) {
                selectedAssignee = ui.item.value;
                if(notifyParam){
                    e.notify(notifyParam, selectedAssignee);
                }
                hideNoMatchAutocomplete(holder);
            },
            open: function() {
                holder.addClass("active-autocomplete");
            },
            close: function() {
                holder.removeClass("active-autocomplete");
            },
            search: function() {
                $(".autocomplete-loader").removeClass("hide");
                hideNoMatchAutocomplete(holder);
            }
        })
        .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            let assigneeImg = (item.imgsrc == undefined) ? "../../images/user_placeholder.png": item.imgsrc;
            if(holder.selector == '#author_input'){
                return $( "<li></li>" )
                .data( "item.autocomplete", item )
                .append( "<a>" + "<img class='author-icon' src='" + assigneeImg + "' /> " +
                "<span class='author-name'>"+ item.label+"</span> </a>" )
                .appendTo( ul );
            }
            else if(holder.selector == '#assignee_input'){
                return $( "<li></li>" )
                .data( "item.autocomplete", item )
                .append( "<a>" + "<img class='assignee-icon' src='" + assigneeImg + "' /> " +
                "<span class='assignee-name'>"+ item.label+"</span> </a>" )
                .appendTo( ul );
            }
            else{
                return $( "<li></li>" )
                .data( "item.autocomplete", item )
                .append( "<a>" + "<img src='" + assigneeImg + "' /> " +
                "<span>"+ item.label+"</span> </a>" )
                .appendTo( ul );
            }
        };
    }
    function renderNoMatchAutocomplete(holder){
        $(holder).addClass("active-autocomplete");
        $(".no-match-autocomplete").show();
    }
    function hideNoMatchAutocomplete(holder){
        $(holder).removeClass("active-autocomplete");
        $(".no-match-autocomplete").hide();
    }

    // Public functions
    return{
        renderAutoComplete: function(holder,data,notifyParam){
            renderAutoComplete(holder,data, notifyParam);
        },
        renderNoMatchAutocomplete: function(holder){
            renderNoMatchAutocomplete(holder);
        },
        hideNoMatchAutocomplete: function(holder){
            hideNoMatchAutocomplete(holder);
        }
    }

}(g);