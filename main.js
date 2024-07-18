document.addEventListener("DOMContentLoaded", () => {
    class ProductManager {
        constructor() {
            this.products = JSON.parse(localStorage.getItem('products')) || [];
            this.editIndex = null;
            this.darkTheme = false;

            this.productNameInput = document.getElementById('productName');
            this.productCategoryInput = document.getElementById('productCategory');
            this.productPriceInput = document.getElementById('productPrice');
            this.productDescriptionInput = document.getElementById('productDescription');
            this.addProductBtn = document.getElementById('addProductBtn');
            this.clearBtn = document.getElementById('clearBtn');
            this.productTable = document.getElementById('productTable');
            this.tbody = this.productTable.querySelector('tbody');
            this.noDataMessage = document.getElementById('noDataMessage');
            this.searchBar = document.getElementById('searchBar');
            this.searchFilter = document.getElementById('searchFilter');
            this.themeToggle = document.getElementById('themeToggle');
            this.themeIcon = document.getElementById('themeIcon');
            this.noResultsAlert = document.getElementById('noResultsAlert');

            this.addProductBtn.addEventListener('click', () => this.addOrUpdateProduct());
            this.clearBtn.addEventListener('click', () => this.clearForm());
            this.searchBar.addEventListener('input', () => this.searchProducts());
            this.productPriceInput.addEventListener('input', () => this.validatePriceInput());
            this.themeToggle.addEventListener('click', () => this.toggleTheme());

            this.renderTable();
        }

        toggleTheme() {
            this.darkTheme = !this.darkTheme;
            document.body.classList.toggle('dark-theme', this.darkTheme);
            this.themeIcon.classList.toggle('fa-moon', !this.darkTheme);
            this.themeIcon.classList.toggle('fa-sun', this.darkTheme);
        }

        renderTable() {
            this.tbody.innerHTML = '';
            if (this.products.length === 0) {
                this.noDataMessage.style.display = 'block';
                this.productTable.style.display = 'none';
            } else {
                this.noDataMessage.style.display = 'none';
                this.productTable.style.display = 'table';
                this.products.forEach((product, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.price}</td>
                        <td>${product.description}</td>
                        <td><button class="btn btn-outline-success" onclick="productManager.editProduct(${index})"><i class="far fa-edit"></i></button></td>
                        <td><button class="btn btn-outline-danger" onmouseover="this.classList.remove('btn-outline-danger'); this.classList.add('btn-danger');" onmouseout="this.classList.remove('btn-danger'); this.classList.add('btn-outline-danger');" onclick="productManager.deleteProduct(${index})"><i class="far fa-trash-alt"></i></button></td>
                    `;
                    this.tbody.appendChild(row);
                });
            }
        }

        clearForm() {
            this.productNameInput.value = '';
            this.productCategoryInput.value = '';
            this.productPriceInput.value = '';
            this.productDescriptionInput.value = '';
            this.addProductBtn.textContent = 'Add Product';
            this.editIndex = null;
        }

        validateInputs() {
            const name = this.productNameInput.value.trim();
            const category = this.productCategoryInput.value.trim();
            const price = this.productPriceInput.value.trim();
            const description = this.productDescriptionInput.value.trim();
            const pricePattern = /^[0-9]+$/;

            if (!name || !category || !price || !description) {
                alert('Please fill in all fields.');
                return false;
            }

            if (!pricePattern.test(price)) {
                alert('Please enter a valid price.');
                return false;
            }

            return { name, category, price, description };
        }

        addOrUpdateProduct() {
            const product = this.validateInputs();
            if (!product) return;

            if (this.editIndex !== null) {
                this.products[this.editIndex] = product;
                this.addProductBtn.textContent = 'Add Product';
            } else {
                this.products.push(product);
            }

            localStorage.setItem('products', JSON.stringify(this.products));
            this.clearForm();
            this.renderTable();
        }

        searchProducts() {
            const query = this.searchBar.value.toLowerCase();
            const filter = this.searchFilter.value;
            const filteredProducts = this.products.filter((product, index) => {
                switch (filter) {
                    case 'name':
                        return product.name.toLowerCase().includes(query);
                    case 'category':
                        return product.category.toLowerCase().includes(query);
                    default:
                        return false;
                }
            });

            this.tbody.innerHTML = '';
            if (filteredProducts.length === 0) {
                this.noResultsAlert.style.display = 'block';
            } else {
                this.noResultsAlert.style.display = 'none';
                filteredProducts.forEach((product, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.price}</td>
                        <td>${product.description}</td>
                        <td><button class="btn btn-success" onclick="productManager.editProduct(${index})"><i class="fas fa-edit"></i></button></td>
                        <td><button class="btn btn-danger" onclick="productManager.deleteProduct(${index})"><i class="fas fa-trash-alt"></i></button></td>
                    `;
                    this.tbody.appendChild(row);
                });
            }
        }

        validatePriceInput() {
            const pricePattern = /^[0-9]*$/;
            if (!pricePattern.test(this.productPriceInput.value)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Input',
                    text: 'Please enter numbers only.',
                });
                this.productPriceInput.value = this.productPriceInput.value.replace(/[^0-9]/g, '');
            }
        }


        editProduct(index) {
            const product = this.products[index];
            this.productNameInput.value = product.name;
            this.productCategoryInput.value = product.category;
            this.productPriceInput.value = product.price;
            this.productDescriptionInput.value = product.description;
            this.addProductBtn.textContent = 'Update Product';
            this.clearBtn.textContent = 'Cancel';
            this.editIndex = index;
        }

        deleteProduct(index) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#3085d6',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.products.splice(index, 1);
                    localStorage.setItem('products', JSON.stringify(this.products));
                    this.renderTable();
                    Swal.fire(
                        'Deleted!',
                        'Your product has been deleted.',
                        'success'
                    );
                }
            });
        }
    }

    window.productManager = new ProductManager();
});




/* ******************************************** Old code without OOP ************************************************************ */
/* document.addEventListener("DOMContentLoaded", () => {
    const productNameInput = document.getElementById('productName');
    const productCategoryInput = document.getElementById('productCategory');
    const productPriceInput = document.getElementById('productPrice');
    const productDescriptionInput = document.getElementById('productDescription');
    const addProductBtn = document.getElementById('addProductBtn');
    const clearBtn = document.getElementById('clearBtn');
    const productTable = document.getElementById('productTable');
    const tbody = productTable.querySelector('tbody');
    const noDataMessage = document.getElementById('noDataMessage');
    const searchBar = document.getElementById('searchBar');
    const searchFilter = document.getElementById('searchFilter');
    const themeToggle = document.getElementById('themeToggle');

    let products = [];
    let editIndex = null;

    const renderTable = () => {
        tbody.innerHTML = '';
        if (products.length === 0) {
            noDataMessage.style.display = 'block';
            productTable.style.display = 'none';
        } else {
            noDataMessage.style.display = 'none';
            productTable.style.display = 'table';
            products.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.price}</td>
                    <td>${product.description}</td>
                    <td><button class="btn btn-outline-success" onclick="editProduct(${index})"><i class="far fa-edit"></i></button></td>
                    <td><button class="btn btn-outline-danger" onmouseover="this.classList.remove('btn-outline-danger'); this.classList.add('btn-danger');" onmouseout="this.classList.remove('btn-danger'); this.classList.add('btn-outline-danger');" onclick="deleteProduct(${index})"><i class="far fa-trash-alt"></i></button></td>
                `;
                tbody.appendChild(row);
            });
        }
    };

    const clearForm = () => {
        productNameInput.value = '';
        productCategoryInput.value = '';
        productPriceInput.value = '';
        productDescriptionInput.value = '';
        addProductBtn.textContent = 'Add Product';
        editIndex = null;
    };

    const validateInputs = () => {
        const name = productNameInput.value.trim();
        const category = productCategoryInput.value.trim();
        const price = productPriceInput.value.trim();
        const description = productDescriptionInput.value.trim();
        const pricePattern = /^[0-9]+$/;

        if (!name || !category || !price || !description) {
            alert('Please fill in all fields.');
            return false;
        }

        if (!pricePattern.test(price)) {
            alert('Please enter a valid price.');
            return false;
        }

        return { name, category, price, description };
    };

    addProductBtn.addEventListener('click', () => {
        const product = validateInputs();
        if (!product) return;

        if (editIndex !== null) {
            products[editIndex] = product;
            addProductBtn.textContent = 'Add Product';
        } else {
            products.push(product);
        }

        clearForm();
        renderTable();
    });

    clearBtn.addEventListener('click', clearForm);

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const filter = searchFilter.value;
        const filteredProducts = products.filter((product, index) => {
            switch (filter) {
                case 'name':
                    return product.name.toLowerCase().includes(query);
                case 'category':
                    return product.category.toLowerCase().includes(query);
                default:
                    return false;
            }
        });

        tbody.innerHTML = '';
        filteredProducts.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td><button class="btn btn-success" onclick="editProduct(${index})"><i class="fas fa-edit"></i></button></td>
                <td><button class="btn btn-danger" onclick="deleteProduct(${index})"><i class="fas fa-trash-alt"></i></button></td>
            `;
            tbody.appendChild(row);
        });
    });

    productPriceInput.addEventListener('input', () => {
        const pricePattern = /^[0-9]*$/;
        if (!pricePattern.test(productPriceInput.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter numbers only.',
            });
            productPriceInput.value = productPriceInput.value.replace(/[^0-9]/g, '');
        }
    });

    window.editProduct = (index) => {
        const product = products[index];
        productNameInput.value = product.name;
        productCategoryInput.value = product.category;
        productPriceInput.value = product.price;
        productDescriptionInput.value = product.description;
        addProductBtn.textContent = 'Update Product';
        editIndex = index;
    };

    window.deleteProduct = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                products.splice(index, 1);
                renderTable();
                Swal.fire(
                    'Deleted!',
                    'Your product has been deleted.',
                    'success'
                )
            }
        })
    };


    renderTable();
}); */

// function isNumber(evt) {
//     var charCode = (evt.which) ? evt.which : evt.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//         return false;
//     }
//     return true;
// }
