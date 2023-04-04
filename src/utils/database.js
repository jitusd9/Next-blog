import { db } from "../../firebaseInit";
import { collection, getDocs,getDoc,doc, addDoc, query, where, limit, startAfter, startAt, orderBy, endBefore, serverTimestamp, deleteDoc } from "firebase/firestore";
import formatDistanceToNow from "date-fns/formatDistanceToNow";



// Users operations

export async function saveUserToDB(user){
  // create a new user with user.uid being the doc id
}


// blog post operations 

export async function getAllPosts() {

  const querySnapshot = await getDocs(collection(db, "posts"));
    let result = []
    querySnapshot.forEach((doc) => {
      result.push(doc.data())
    });

    return result;
}

export async function getPostBySlug(slug) {

  console.log(slug)

  const q = query(collection(db, "posts"), where("slug", "==", slug));

  const result = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    data.createdAt = data?.createdAt ? formatDistanceToNow(data?.createdAt.toDate(), { addSuffix: true }) : null;
    result.push(data);
  });

  return result[0]
}

export async function getPostByAuthor(mailid) {

  console.log(mailid)

  const q = query(collection(db, "posts"), where("author", "==", mailid), orderBy("createdAt", "desc"), limit(3));

  const result = []
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id
    result.push(data)
  });

  let sortedData = result.sort((a,b) => b.createdAt - a.createdAt) 

  sortedData = sortedData.map((doc) => {

    doc.createdAt = doc?.createdAt ? formatDistanceToNow(doc?.createdAt.toDate(), { addSuffix: true }) : null;
    return doc

  });

  return sortedData
}

export async function createPost( title, content, excerpt, author ) {
  const slug = createSlug(title);
  const date = new Date();

  const docRef = await addDoc(collection(db, "posts"), {
    title,
    content,
    author,
    slug,
    excerpt,
    createdAt: serverTimestamp()
  });
  console.log("Document written with ID: ", docRef.id);
  if(docRef.id){
    return docRef.id
  }else{
    return 'Error while creating post'
  }
}

export function updatePost({ id, title, content }) {
  
}

export async function deletePost(id) {
  console.log("Deleting post", id);
  return await deleteDoc(doc(db, "posts", id));
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
}

export async function getAllPostsPerPage(first,last){

  let querySnapshot 
  if(last){

    const docSnap = await getDoc(doc(collection(db, "posts"), last));
    querySnapshot = query(collection(db, "posts"), orderBy('createdAt', 'desc'), startAfter(docSnap),limit(3));

  }else if(first){

    const docSnapStart = await getDoc(doc(collection(db, "posts"), first));
    const docSnapEnd = await getDoc(doc(collection(db, "posts"), last));
    querySnapshot = query(collection(db, "posts"), orderBy('createdAt', 'desc'),startAt(docSnapStart), endBefore(docSnapEnd),limit(3));

  }else{
    querySnapshot = query(collection(db, "posts"), orderBy('createdAt', 'desc'),limit(3));
  }

  const documentSnapshots = await getDocs(querySnapshot);

  const posts = [];

  documentSnapshots.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id
    data.createdAt = data?.createdAt ? formatDistanceToNow(data?.createdAt.toDate(), { addSuffix: true }) : null;
    posts.push(data)
  })

  // console.log('Fist', documentSnapshots.docs[0].id)

  const data = {
    posts,
    firstVisible:  documentSnapshots.docs[0]?.id, 
    lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1]?.id
  };

  return data
}


// comments operations firebse

export const commentsRef = collection(db, "comments")

export async function createComment( content, authorId, postId ) {
 
  const docRef = await addDoc(collection(db, "comments"), {
    content,
    authorId,
    postId,
    createdAt: serverTimestamp()
  });
  console.log("Document written with ID: ", docRef.id);
  if(docRef.id){
    return docRef.id
  }else{
    return 'Error while creating post'
  }

}

export async function getCommentsByPost(postId){

  const q = query(commentsRef, where("postId", "==", postId), orderBy("createdAt", "desc"));

  const querySnapshot = await getDocs(q);

  if(querySnapshot){
    const newComments = []
    querySnapshot.forEach((doc) => {
      newComments.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return newComments
  }else{
    return 404
  }

    
   

}

export async function deletComment(postId){

}