import { collection, addDoc, query, getDocs, where } from "firebase/firestore"
import { db, auth } from "../firebase/firebase"

async function addCategory(data) {
    data.uid = auth.currentUser?.uid;
    try {
        const docRef = await addDoc(collection(db, "categories"), data);

        console.log("Category created, ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error creating account: ", e);
    }
}

async function getUserCategories() {

    try {
        const uid = auth.currentUser?.uid;
    
        const categories = [];
    
        const q = query(collection(db, "categories"), where("uid", "==", uid));
        
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            console.log(doc);
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

        
    }
}

export {
    addCategory,
    getUserCategories,

}