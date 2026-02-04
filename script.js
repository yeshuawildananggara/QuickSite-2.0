document.addEventListener('DOMContentLoaded', () => {

  const validate = {
    email: e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
    text: t => t.trim().length > 1
  };

  window.nextStep = step => {
    document.querySelectorAll('.error-text').forEach(e => e.style.display='none');
    document.querySelectorAll('input').forEach(i => i.classList.remove('invalid'));

    if(step === 2){
      const name = nameInput.value;
      const email = emailInput.value;
      let fail=false;

      if(!validate.text(name)){ nameInput.classList.add('invalid'); fail=true; }
      if(!validate.email(email)){ emailInput.classList.add('invalid'); fail=true; }

      if(fail) return;

      step1.style.display='none';
      step2.style.display='block';
      indicator2.classList.add('active');
    }
  };

  const orderForm = document.getElementById('orderForm');
  if(orderForm){
    orderForm.addEventListener('submit', e=>{
      e.preventDefault();
      successMessage.style.display='block';
      setTimeout(()=>location.href='checkout.html',1000);
    });
  }
// =========================
// ORDER FORM → CHECKOUT
// =========================

const orderForm = document.getElementById('orderForm');

if (orderForm) {
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // simple validation
    const inputs = orderForm.querySelectorAll('input, textarea');
    for (let input of inputs) {
      if (!input.value.trim()) {
        input.focus();
        return;
      }
    }

    // go to checkout
    window.location.href = "checkout.html";
  });
}
