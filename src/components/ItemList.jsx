import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import InputForm from './InputForm';
import Item from './Item';

const ItemList = props => {

  const [todoList, setTodoList] = useState(null);

  // firestoreから全データを取得してstateに格納する関数
  const getTodosFromFirestore = async () => {

    //firebaseのデータベースのところから抽出
    const itemListArray = await firebase.firestore().collection('todos')
      .orderBy('isDone')
      .orderBy('limit')
      .get();

      //id、dataをとってくる。
      const todoArray = itemListArray.docs.map(x => {
      return {
        id: x.id,
        data: x.data(),
      }

    })
    setTodoList(todoArray);
    return todoArray;
  }

  // useEffectを利用してFirestoreからデータの一覧を取得．
  useEffect(() => {
    const result = getTodosFromFirestore();
  }, [props])

  return (
    <div>
        <InputForm
        getTodosFromFirestore={getTodosFromFirestore}
        />
      <ul>
        {
            //todoListがあるときだけmap関数の処理を実行する。
          todoList?.map((x, index) =>
            <Item
                key={index}
                todo={x}
                index={index}
                getTodosFromFirestore={getTodosFromFirestore}
            />
            // <li key={index} id={x.id}>
            //   <input type="checkbox" value={x.id} />
            //   <button value={x.id}>delete</button>
            //   <p>締め切り：{x.data.limit.seconds}</p>
            //   <p>やること：{x.data.todo}</p>
            // </li>
          )
        }
      </ul>
    </div>
  );
}
export default ItemList;