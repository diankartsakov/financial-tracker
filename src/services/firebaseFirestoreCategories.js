import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db, auth } from "../firebase/firebase"

async function addCategory(data) {
    data.uid = auth.currentUser?.uid;
    try {
        if (data.category.trim() === "") {
            return {error: "Please provide a name for the category."}
        }

        const isCategoryExist = await checkIsCategoryExist(data.category);
        
        if (isCategoryExist) {
            return {error: "A category with that name already exists. Please choose a different name."
        }
        }

        const docRef = await addDoc(collection(db, "categories"), data);

        const result = {
            ...data,
            icon: JSON.parse(data.icon),
            id: docRef.id,
        }

        console.log("Category created, ID: ", docRef.id);
        return result;
    } catch (e) {
        console.error("Error creating account: ", e);
    }
}

async function editCategory(data, categoryId) {
    data.uid = auth.currentUser?.uid;

    try {
        if (data.category.trim() === "") {
            return {error: "Please provide a name for the category."}
        }

        const isCategoryExist = await checkIsCategoryExist(data.category, categoryId);
        
        if (isCategoryExist) {
            return {
                error: "A category with that name already exists. Please choose a different name."
            }
        }

        const docRef = doc(db, "categories", categoryId);

        const result = await updateDoc(docRef, data);

        return result
    } catch (e) {
        console.error("Error edditing category: ", e);
        return {error: e}
    }
}

async function deleteCategory(categoryId) {
    
    try {
        const docRef = await deleteDoc(doc(db, "categories", categoryId));
    } catch (e) {
        console.error("Error edditing category: ", e);
        return {error: e}
    }
}

async function getUserCategories(uidParam) {

    try {
        const uid = uidParam || auth.currentUser?.uid;

        const categories = [];
    
        const q = query(collection(db, "categories"), where("uid", "==", uid));
        
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            const docData = {
              id: doc.id,
              category: doc._document.data.value.mapValue.fields.category.stringValue,
              icon: JSON.parse(doc._document.data.value.mapValue.fields.icon.stringValue),
              iconColor: doc._document.data.value.mapValue.fields.iconColor.stringValue,
              iconSize: doc._document.data.value.mapValue.fields.iconSize.stringValue, 
              categoryBackground: doc._document.data.value.mapValue.fields.categoryBackground.stringValue,
            }
    
            categories.push(docData);
        });

        return categories;
    } catch(e) {
        console.error("Error get categories: ", e);
    }
}

async function checkIsCategoryExist(category, categoryId=null) {
    const uid = auth.currentUser.uid

    let isExist = false;

    const q = query(collection(db, "categories"), where("uid", "==", uid), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        if (categoryId !== doc.id) {
            isExist = true;
        }
    });
    return isExist;
} 

export {
    addCategory,
    editCategory,
    deleteCategory,
    getUserCategories,
}