// import { Timestamp, doc, setDoc } from 'firebase/firestore';
// import { db } from './config';
// export const addDocument = (collection, data)=>{
//     const query = setDoc(doc(db, collection, "login"), {...data, createdAt: db.FieldValue.Timestamp()});
// }
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const addDocument = (collectionName, data) => {
  const query = collection(db, collectionName);
  addDoc(query, {
    ...data,
    createdAt: serverTimestamp(),
  });
};
export const getDocument = async (path) => {
    const snapshot = await db.doc(path).get();
    return snapshot.exists ? snapshot.data() : null;
  };
// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(' ').filter((word) => word);
  
    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];
  
    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
      flagArray[i] = false;
    }
  
    const createKeywords = (name) => {
      const arrName = [];
      let curName = '';
      name.split('').forEach((letter) => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    };
  
    function findPermutation(k) {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];
  
          if (k === length - 1) {
            stringArray.push(result.join(' '));
          }
  
          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    }
  
    findPermutation(0);
  
    const keywords = stringArray.reduce((acc, cur) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);
  
    return keywords;
  };
