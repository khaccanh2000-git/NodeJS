document.getElementById('year').innerHTML = new Date().getFullYear();
const root=location.protocol+"//"+location.host

$('.addToCart').click(function(event){
    event.preventDefault();
    const href = this.href
    console.log(href)
    $.ajax({
        url:href,
        type:'GET',
        data:{},
        success: function () {
            swal("Add successfully", "Continue", "success");
            $("#numCart1").load(root+" #numCart2");     
        }
    })
})

$('.deleteFormCart').on("submit",function (event) {
    event.preventDefault()
    const action=$(this).attr('action') 
    const href = root + action
    const tr_cart_id = "#tr_cart_"+ $(this).data("id")
    console.log(tr_cart_id)

    $.ajax({
        url: href,
        type: 'POST',
        data:{},
        success:function(){
            console.log("delete ok")
            swal("Delete successful!", "continute!", "success");
            $("#total1").load(root+"/cart #total2");
            $(tr_cart_id).empty();
        }
    })
})




