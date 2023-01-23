g.autoComplete = function(){

    function renderAutoComplete(holder,data){
        holder.autocomplete({
            source: data,
            minLength: 1,
            response: function(event, ui) {
                $(".autocomplete-loader").addClass("hide");
                if(ui.content.length < 1){
                    renderNoMatchAutocomplete();
                }
            },
            select: function (event, ui) {
                selectedAssignee = ui.item.value;
                hideNoMatchAutocomplete();
            },
            open: function() {
                holder.addClass("active-autocomplete");
            },
            close: function() {
                holder.removeClass("active-autocomplete");
            },
            search: function() {
                $(".autocomplete-loader").removeClass("hide");
                hideNoMatchAutocomplete();
            }
           
        });
    }
    function renderNoMatchAutocomplete(){
        $('#assignee_input').addClass("active-autocomplete");
        $(".no-match-autocomplete").show();
    }
    function hideNoMatchAutocomplete(){
        $('#assignee_input').removeClass("active-autocomplete");
        $(".no-match-autocomplete").hide();
    }

    // Public functions
    return{
        renderAutoComplete: function(holder,data){
            renderAutoComplete(holder,data);
        },
        renderNoMatchAutocomplete: function(){
            renderNoMatchAutocomplete();
        },
        hideNoMatchAutocomplete: function(){
            hideNoMatchAutocomplete();
        }
    }
 
}(g);