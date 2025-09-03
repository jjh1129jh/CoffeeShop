import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { useDispatch } from 'react-redux';
import { addQuantity } from '../../src/store.js'

function CoffeeDetailPage(props) {
    let {id} = useParams();
    let [addNum, setAddNum] = useState(0) //주문수량
    let dispatch = useDispatch()
    let [gocart, setGocart] = useState(0)

    function addNumClick(e) {
        if(e == "+"){
            if(addNum != 99){ //99개 이상 담을 수 없음
                setAddNum(addNum + 1)
            }
        }else if(e == "-"){
            if(addNum != 0){
                setAddNum(addNum - 1)
            }
        }
        else{
            alert("잘못된 값 전달")
        }
    }

    return(
      <>
        {
          gocart == 1 //상품이 담겼을때 장바구니 안내 메시지를 띄운다.
          ?  <div className='message'>
              <div className='message_bg'>
                <div className='message_box'>
                  <img className='message_cart' src="/CoffeeShop/img/cart.png" alt="장바구니" />
                  <p>장바구니에 상품을 담았습니다.</p>
                  <div className="massagebtnBox">
                    <button className='massagebtn' onClick={()=>{setGocart(0);setAddNum(0)}}>계속 쇼핑</button>
                    <button className='massagebtn cart' onClick={()=>{props.navigate('/cart');props.setNavber(0)}}>장바구니 이동</button>
                    <button className='close' onClick={()=>{setGocart(0);setAddNum(0)}}></button>
                    {/* 장바구니 메시지를 종료하고 주문수량도 다시 0으로 초기화한다. */}
                  </div>
                </div>
              </div>
            </div>
          : null
        }
        <CardGroup>
          <Card>
            <button className='prev' onClick={()=>{props.navigate('/order');props.setNavber(0)}}>{`< MENU`}</button>
            <button className='next' onClick={()=>{props.navigate('/cart');props.setNavber(0)}}>{`CART >`}</button>
            <Card.Img variant="top" src={`/CoffeeShop/img/coffee_${props.orderlist[id].id + 1}.png`} />
            <Card.Body>
              <Card.Title>{props.orderlist[id].title}</Card.Title>
              <Card.Text>{props.orderlist[id].content}</Card.Text>
              <Card.Text>{`${props.orderlist[id].price.toLocaleString()}원`}</Card.Text>
              <div className='cardAdd'>
                <div className='cardAddNumber'>
                    <button className='addnumbtn down' onClick={()=>{addNumClick("-")}}>-</button>
                    <div><p>{addNum}</p></div>
                    <button className='addnumbtn up' onClick={()=>{addNumClick("+")}}>+</button>
                </div>
                {
                  addNum == 0
                  ? <button className='card_addtocart disable'>ADD TO CART</button>

                  : <button className='card_addtocart' onClick={()=>{
                      dispatch(addQuantity({id : props.orderlist[id].id , title : props.orderlist[id].title, price : props.orderlist[id].price, count : addNum,  type : props.orderlist[id].type}));
                      setGocart(1) //장바구니 메시지를 띄운다.
                    }}>ADD TO CART</button>
                }
              </div>
            </Card.Body>
          </Card>
        </CardGroup>
      </>
    )
}

export default CoffeeDetailPage;