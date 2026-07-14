import {
    itemsRef,
    push,
    set,
    update,
    remove,
    onValue,
    child
} from "./firebase.js";

let items = [];
let editingKey = null;


// =====================
// DOM ELEMENTS
// =====================

const inventory = document.getElementById("inventory");
const modal = document.getElementById("modal");

const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const modalTitle = document.getElementById("modalTitle");

const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemStock = document.getElementById("itemStock");
const itemCategory = document.getElementById("itemCategory");

const searchInput = document.getElementById("searchInput");

const totalItems = document.getElementById("totalItems");
const lowStock = document.getElementById("lowStock");


// =====================
// BUTTON EVENTS
// =====================

addBtn.addEventListener("click", () => {

    resetForm();

    modalTitle.textContent = "Add Item";

    modal.style.display = "flex";

});


cancelBtn.addEventListener("click", () => {

    closeModal();

});


saveBtn.addEventListener("click", saveItem);



window.addEventListener("click", (e)=>{

    if(e.target === modal){

        closeModal();

    }

});



// =====================
// MODAL FUNCTIONS
// =====================

function openEditModal(item){

    editingKey = item.key;

    modalTitle.textContent = "Edit Item";


    itemName.value = item.name;
    itemPrice.value = item.price;
    itemStock.value = item.stock;
    itemCategory.value = item.category || "";


    modal.style.display = "flex";

}



function closeModal(){

    modal.style.display = "none";

    resetForm();

}



function resetForm(){

    editingKey = null;

    itemName.value = "";
    itemPrice.value = "";
    itemStock.value = "";
    itemCategory.value = "";

    if(modalTitle){

        modalTitle.textContent = "Add Item";

    }

}

// =====================
// SAVE ITEM
// =====================

async function saveItem(){

    const name = itemName.value.trim();
    const price = Number(itemPrice.value);
    const stock = Number(itemStock.value);
    const category = itemCategory.value.trim();


    if(!name){

        alert("Item name is required.");

        return;

    }


    if(isNaN(price) || price < 0){

        alert("Enter a valid price.");

        return;

    }


    if(isNaN(stock) || stock < 0){

        alert("Enter a valid stock quantity.");

        return;

    }



    const data = {

        name,
        price,
        stock,
        category,

        updatedAt: Date.now()

    };



    try{


        if(editingKey === null){


            const newItem = push(itemsRef);


            await set(newItem, {

                ...data,

                createdAt: Date.now()

            });


        }
        else{


            await update(

                child(itemsRef, editingKey),

                data

            );


        }



        closeModal();


    }
    catch(error){


        console.error(error);

        alert("Failed to save item.");

    }


}



// =====================
// LOAD INVENTORY
// =====================

onValue(itemsRef, (snapshot)=>{


    items = [];


    if(snapshot.exists()){


        snapshot.forEach((childSnapshot)=>{


            items.push({

                key: childSnapshot.key,

                ...childSnapshot.val()

            });


        });


    }



    render(items);


});




// =====================
// RENDER INVENTORY
// =====================

function render(list){


    inventory.innerHTML = "";


    let lowCount = 0;



    totalItems.textContent = list.length;



    list.forEach(item=>{


        if(Number(item.stock) <= 5){

            lowCount++;

        }



        inventory.innerHTML += `


        <div class="itemCard">


            <h3>
                ${item.name}
            </h3>


            <p>
                Price: ₱${Number(item.price).toFixed(2)}
            </p>


            <p>
                Stock: ${item.stock}
            </p>


            <p>
                Category:
                ${item.category || "General"}
            </p>



            ${
                Number(item.stock)<=5
                ?
                `<span class="lowStock">
                    ⚠️ Low Stock
                 </span>`
                :
                ""
            }



            <div class="actions">


                <button 
                class="editBtn"
                data-id="${item.key}">
                    Edit
                </button>



                <button 
                class="deleteBtn"
                data-id="${item.key}">
                    Delete
                </button>


            </div>


        </div>


        `;


    });



    lowStock.textContent = lowCount;



    attachActions();


}

// =====================
// BUTTON ACTIONS
// =====================

function attachActions(){


    // EDIT

    document.querySelectorAll(".editBtn")
    .forEach(button=>{


        button.addEventListener("click", ()=>{


            const id = button.dataset.id;


            const item = items.find(
                data => data.key === id
            );


            if(item){

                openEditModal(item);

            }


        });


    });





    // DELETE

    document.querySelectorAll(".deleteBtn")
    .forEach(button=>{


        button.addEventListener("click", async ()=>{


            const id = button.dataset.id;



            const confirmDelete = confirm(
                "Delete this item?"
            );



            if(!confirmDelete){

                return;

            }



            try{


                await remove(
                    child(itemsRef, id)
                );


            }
            catch(error){


                console.error(error);

                alert(
                    "Failed to delete item."
                );


            }


        });


    });


}



// =====================
// SEARCH
// =====================

searchInput.addEventListener(
"input",
()=>{


    const keyword =
    searchInput.value
    .toLowerCase()
    .trim();



    if(keyword === ""){


        render(items);

        return;

    }




    const filtered = items.filter(item=>{


        return (

            item.name
            .toLowerCase()
            .includes(keyword)

            ||

            (item.category || "")
            .toLowerCase()
            .includes(keyword)


        );


    });



    render(filtered);



});




// =====================
// ESCAPE CLOSE MODAL
// =====================

document.addEventListener(
"keydown",
(e)=>{


    if(e.key === "Escape"){


        closeModal();


    }


});




// =====================
// DASHBOARD REFRESH
// =====================

function refreshDashboard(){


    totalItems.textContent =
    items.length;



    lowStock.textContent =
    items.filter(
        item => Number(item.stock)<=5
    ).length;


}



// =====================
// AUTO REFRESH
// =====================

setInterval(()=>{


    refreshDashboard();


},1000);

