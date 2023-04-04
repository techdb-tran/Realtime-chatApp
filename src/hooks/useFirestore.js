import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = condition
      ? query(collectionRef, where(condition.fieldName||null, condition.operator||null, condition.compareValue||null), orderBy('createdAt'))
      : query(collectionRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(documents);
    });

    return () => unsubscribe();
  }, [collectionName, condition]);

  return documents;
};

export default useFirestore;
