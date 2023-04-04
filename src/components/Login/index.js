import React from "react";
import { Row, Col, Button } from 'antd'
import Title from "antd/es/typography/Title";
import { auth } from "../../firebase/config";
import { addDocument, generateKeywords, getDocument } from "../../firebase/service";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new FacebookAuthProvider();

export default function Login() {

    const handleFacebookLogin = async () => {
        //    const {additionalUserInfo, user}= await auth.signInWithPopup(provider);
        //    if(additionalUserInfo?.isNewUser){
        //     addDocument('users',{
        //         displayName: user.displayName,
        //         email: user.email,
        //         photoURL: user.photoURL,
        //         uid: user.uid,
        //         providerId: additionalUserInfo.providerId
        //       });
        signInWithPopup(auth, provider)
            .then((userCredential) => {
                // The signed-in user info.
                console.log("User info: ", userCredential.user);
                const userDoc = getDocument("users", userCredential.user.uid);
                if(!userDoc.exists){
                    addDocument("users", {
                        email: userCredential.user.email,
                        displayName: userCredential.user.displayName,
                        photoURL: userCredential.user.photoURL,
                        uid: userCredential.user.uid,
                        keywords: generateKeywords(userCredential.user.displayName),
                    });
                } else{
                    console.log("user already exists in database")
                }
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);

                // ...
            });
    };
    return (
        <div>
            <Row justify='center'>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>Fun Chat</Title>
                    <Button>Đăng nhập bằng Google</Button>
                    <Button onClick={handleFacebookLogin}>Đăng nhập bằng Facebook</Button>
                </Col>
            </Row>
        </div>
    )
}