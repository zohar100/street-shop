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
    var images = document.querySelectorAll('.slideImages');
    var nextBtn = document.querySelector('#next-button');
    var prevBtn = document.querySelector('#previous-button');
    var count = 0;
    var imagesLen = images.length -2;

    nextBtn.addEventListener('click', function(){
        if(count > imagesLen){
            count = 0; 
        }else{
            count++;
        }
        for(var i=0;i < images.length;i++){
            if(images[i] != images[count]){
                images[i].style.opacity = '0';
            }else{
                images[count].style.opacity = '1';
            }
        }
    });

    prevBtn.addEventListener('click', function(){
        if(count < imagesLen){
            count = imagesLen; 
        }else{
            count--;
        }
        for(var i=0;i < images.length;i++){
            if(images[i] != images[count]){
                images[i].style.opacity = '0';
            }else{
                images[count].style.opacity = '1';
            }
        }
    });
}

init();