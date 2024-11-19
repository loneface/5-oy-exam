async function fetchProduct(productID) {
  try {
    const response = await fetch(
      "http://localhost:5000/products/" + productID.toString()
    );
    const product = await response.json();

    document.getElementById("product-title").innerText = product.data.name;
    document.getElementById("product-image").src = product.data.image;
    document.getElementById("product-description").innerText =
      product.data.description;
    document.getElementById("product-price").innerText = product.data.price;
    setStarRating(product.data.rating);
    document.getElementById("product-addToBasket-Button").onclick =
      function () {
        addToBasket(
          productID,
          product.data.name,
          product.data.price,
          product.data.image
        );
      };
  } catch (error) {
    console.log(error);
  }
}

function displayBasket() {
  const basket = JSON.parse(localStorage.getItem("basket")) || [];
  const basketContainer = document.getElementById("basket");
  const amountInBasket = document.getElementById("amountInBasket");
  const totalId = document.getElementById("basketTotal");

  if (basket.length === 0) {
    amountInBasket.innerHTML = "<h2>Savatingiz bo'sh</h2>";
    totalId.innerHTML = "Umumiy hisob: 0";
    basketContainer.innerHTML = "";
    return;
  }

  basketContainer.innerHTML =
    "<table id='basket' colspan=4 style='width: 90%;'><td  style='width: 20%;'></td><td  style='width: 37%;text-align: center;'>Mahsulot nomi</td><td  style='width: 10%;text-align: center;'>Soni</td><td  style='width: 10%;text-align: center;'>Narxi</td></table>";

  amountInBasket.innerHTML =
    "<h2>Savatingizda " + basket.length + " ta mahsulot bor</h2>";

  basket.forEach((item) => {
    const basketItem = document.createElement("tr");
    basketItem.innerHTML =
      "<td style='width: 20%;'><img style='width:100%;' src='" +
      item.productImage +
      "'/></td><td style='width: 50%;'><h2>" +
      item.productName +
      "</h2><br><br><button onclick='removeFromBasket(" +
      item.productID +
      ")'>Savatdan o'chir</button></td><td style='width: 10%;'><h2>" +
      item.quantity +
      "</h2></td><td style='width: 20%;'><h2>" +
      item.productPrice +
      "</h2></td>";
    basketContainer.appendChild(basketItem);
  });

  const total = basket.reduce((sum, item) => {
    const price = parseFloat(item.productPrice) || 0;
    return sum + price;
  }, 0);
  totalId.innerHTML = "Umumiy hisob: " + total.toFixed(2);
}

function addToBasket(productID, productName, productPrice, productImage) {
  let basket = JSON.parse(localStorage.getItem("basket")) || [];

  const existingProductIndex = basket.findIndex(
    (item) => item.productID === productID
  );

  if (existingProductIndex !== -1) {
    alert("Bu mahsulot savatingizda mavjud.");
  } else {
    basket.push({
      productID,
      productName,
      productPrice,
      productImage,
      quantity: 1,
    });
    alert("Mahsulot savatingizga qo'shildi.");
  }

  localStorage.setItem("basket", JSON.stringify(basket));
}

function removeFromBasket(productID) {
  let basket = JSON.parse(localStorage.getItem("basket")) || [];

  basket = basket.filter((item) => item.productID != productID);

  localStorage.setItem("basket", JSON.stringify(basket));

  displayBasket();
}

function clearBasket() {
  localStorage.removeItem("basket");
  displayBasket();
}

function getUrlId() {
  const urlParamaters = new URLSearchParams(window.location.search);
  return urlParamaters.get("id");
}

function goToProductPage(id) {
  const baseUrl = window.location.origin;
  const currentPath = window.location.pathname;
  const folderPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
  window.location.href =
    baseUrl + folderPath + "/product-details.html?id=" + id.toString();
}

function setStarRating(ratingValue) {
  let stars = document.querySelectorAll("#star-rating i");
  let fullStars = Math.floor(ratingValue);
  let halfStar = ratingValue % 1 >= 0.5;

  stars.forEach((star) => {
    star.classList.remove("fas", "fa-star-half-alt", "far");
  });

  for (let i = 0; i < fullStars; i++) {
    stars[i].classList.add("fas", "fa-star");
  }

  if (halfStar && fullStars < stars.length) {
    stars[fullStars].classList.add("fas", "fa-star-half-alt");
  }

  for (let i = fullStars + (halfStar ? 1 : 0); i < stars.length; i++) {
    stars[i].classList.add("far", "fa-star");
  }
}
