function init(){
    paypalPayment();
    imageSlide();
}

function paypalPayment(){
    var totalPrice = document.getElementById("totalPrice").innerHTML;
    // Render the PayPal button into #paypal-button-container
    paypal.Buttons({
    // Set up the transaction
        createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: Number(totalPrice)
                        }
                    }]
                });
        },
            
    // Finalize the transaction
        onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                // Show a success message to the buyer
                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
                });
        },
    
        style: {
                layout: 'horizontal'
            }
                  
    }).render('#paypal-button-container');
}

function imageSlide(){
    var images = document.getElementsByClassName("slideImages");

    for(var i=0;i<images.length;i++){
        images[i].style.display= "none"
    }
}

init();