let users = [];
let sortingOption = "lastName";
let sortOrder = 1;

$(document).ready(function () {
  $.get("https://jsonplaceholder.typicode.com/users", function(data){
    users = data;
    users.sort(sorting());
    $(".loader").hide()
    appendUsers();
  })

  $("#sortingOption").change(function () {
    sortingOption = $(this).val();
    users.sort(sorting());
    appendUsers();
  });

  $("#sortType").change(function () {
    if ($(this).val() === "ascending") {
      sortOrder = 1;
    } else {
      sortOrder = -1;
    }
    users.sort(sorting());
    appendUsers();
  });

  $('.modal-toggle').on('click', function (e) {
    e.preventDefault();
    $('.modal').toggleClass('is-visible');
  });

  $("#userForm").submit(function(e){
    e.preventDefault(e);
    var data = $('#userForm').serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    if (Object.entries(data).filter(a => a[1].length > 0).length === 0) {
      alert('Please Fill All Attributes')
      return
    }
    $(".loader").show();

    const userData = {
      "name": data["name"],
      "username": data["username"],
      "email": data["email"],
      "address": {
        "street": data["street"],
        "suite": data["suite"],
        "city": data["city"],
        "zipcode": data["zipcode"],
        "geo": {
          "lat": data["lat"],
          "lng": data["lng"],
        }
      },
      "phone": data["phone"],
      "website": data["website"],
      "company": {
        "name": data["companyName"],
        "catchPhrase": data["catchPhrase"],
        "bs": data["bs"]
      }
    }
    $.ajax({
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/users",
      data: userData
    })
      .done(function (msg) {
        users.push(userData);
        users.sort(sorting());
        appendUsers();
        $('.modal').toggleClass('is-visible');
        $(".loader").hide();
      });
  });
})


function appendUsers() {
  $('#users').empty();
  for (let i = 0; i < users.length; i++){
    $('#users').append(createUserCard(users[i]));
  }
}


function sorting() {
  return function (fUser, sUser) {
    let fUserProperty = '';
    let sUserProperty = '';
    if (sortingOption === 'lastName') {
      fUserProperty = fUser.name.split(' ').slice(-1)[0] || "";
      sUserProperty = sUser.name.split(' ').slice(-1)[0] || "";  
    } else {
      fUserProperty = fUser.address.zipcode;
      sUserProperty = sUser.address.zipcode;
    }
    var result = (fUserProperty < sUserProperty) ? -1 : (fUserProperty > sUserProperty) ? 1 : 0;
    return result * sortOrder;
  }
}

function createUserCard(user) {
  return(
    `<div class="card-wrapper">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg" alt="sample87" />
    <div class="card-details">
      <img src="https://d2jyir0m79gs60.cloudfront.net/prime/tutor-video-m.svg" alt="profile-sample4"
        class="profile" />
      <h2>${user.name}<span>${user.company.name}</span></h2>
      <ul>
        <li>Email: <a href="mailto:${user.email}">${user.email}</a></li>
        <li>Phone: <a href="tel:${user.phone}">${user.phone}</a></li>
        <li>Website: <a href=${user.website}>${user.website}</a></li>
        <li>Address: ${user.address.street}, ${user.address.suite}</li>
        <li>ZipCode: ${user.address.zipcode}</li>
      </ul>
    </div>
  </div>`
  )
}