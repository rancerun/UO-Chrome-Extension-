
//code is injected to gain access to global variable

//page_breadcrumb is used over product_category as some product pages categories listed outside of the five default categories such as PRODUCTTRAY

let injectedCode = `
extensionString = "jdhehelcioinbgiikbakpfhbjakcknbc";

if (utag_data.page_type == "product") {
  chrome.runtime.sendMessage(extensionString, {category: utag_data.page_breadcrumb[0], count: 1});

  let cartButton = document.getElementsByClassName("js-add-to-cart")[0];

  cartButton.addEventListener("click", function() {
    chrome.runtime.sendMessage(extensionString, {category: utag_data.page_breadcrumb[0], count: 3});
  });
};
`;

let script = document.createElement("script");
script.textContent = injectedCode;
(document.head||document.documentElement).appendChild(script);
script.remove();