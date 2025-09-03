import React,{ useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { reset, addCount, subCount } from '../../src/store.js'
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';

function Cart(props) {

    let quantity = useSelector((state)=>{return state.quantity})
    let dispatch = useDispatch()
    let [discount, setDiscount] = useState(1) //할인율 1 : 100퍼 가격
    let [specialdiscount, setSpecialiscount] = useState(1) //할인율 1 : 100퍼 가격
    let totalPrice = quantity.reduce((total, item) =>{ //reduce = 배열이나 오브젝트의 값을 하나로 축소하는 함수
       if(item.type == 'S'){ //스페셜 메뉴임?
        return total + (item.price * discount * specialdiscount) * item.count 
       }
       else{
        return total + (item.price * discount) * item.count 
       }
         
    },0);
    let staticTotalPrice = quantity.reduce((total, item) =>{ return total + (item.price) * item.count },0); //할인이 들어가기 이전의 총합
    let [whatcoupon, setWhatcoupon] = useState('') //현재 무슨 쿠폰이 적용됐는지 함수에 쓰기위한 변수

    //quantity.reduce 각각의 역할
    //total = item을 더한값을 담는 역할
    //item = 현재 차례의 배열값
    // 끝의 0 = total의 초기값

    useEffect(()=>{
      if(whatcoupon == '20Consolation' && staticTotalPrice < 20000){
        sale(0, 1) //2만원 이하가 됐으니 20,000 이상 적용 쿠폰 강제 해제
      }
    },[staticTotalPrice])


    function sale(e, f) { //쿠폰 적용
      setDiscount(1) //전체 할인 미적용
      setSpecialiscount(1)//스무디 할인 미적용
      console.log(f)
      console.log(staticTotalPrice)
      if(f == '20Consolation' && staticTotalPrice < 20000){ // 2만원 위인가?
        alert('해당 쿠폰은 20,000원 이상 주문 시 사용 가능합니다.')
      }else{
        setWhatcoupon(f)
        if(f != 'S'){
        setDiscount(1 - (e * 0.01)) //전체 할인
        }
        else{
          setDiscount(1) //전체 할인 미적용
          setSpecialiscount(1 - (e * 0.01)) //특별 메뉴만 할인 적용 *현재는 스무디만 적용
        }
      }

    }
    
    return(
        <Container className='container_cart'>
          <button className='clear' onClick={()=>{dispatch(reset())}}>CLEAR</button>
            <Table striped bordered hover>

                <thead>
                  <tr>
                    <th colSpan={2}>상품명</th>
                    <th style={{ width: "18%" }}>수량</th>
                    <th style={{ width: "18%" }}>금액</th>
                  </tr>
                </thead>

                <tbody>
                {
                    quantity.length != 0
                    ?   quantity.map(function (item, i) {
                            return(
                            <tr key={i}>
                              <td style={{backgroundImage:`url(./img/coffee_${item.id+1}.png`, backgroundRepeat: "no-repeat", backgroundPosition: "center",backgroundSize:"100%",width:"100px",height:"100px"}}></td>
                              {/* 스타일을 길게 풀어쓴 이유? =  background는 shorthand뭐시기라는데 충돌이 일어날수있어서 longhand 속성으로 적으라함*/}
                              <td><p>{item.title}</p></td>
                              <td>
                                <div className='cart_Count'>
                                    <button className='cart_Count_btn' onClick={()=>{dispatch(subCount(item.id))}}>-</button>
                                    <div    className='cart_Count_box'><span>{item.count}</span></div>
                                    <button className='cart_Count_btn' onClick={()=>{dispatch(addCount(item.id))}}>+</button>
                                </div>
                                <div className='cart_Count_m'>
                                    <div    className='cart_Count_box'><span>{item.count}</span></div>
                                    <div>
                                      <button className='cart_Count_btn' onClick={()=>{dispatch(subCount(item.id))}}>-</button>
                                      <button className='cart_Count_btn' onClick={()=>{dispatch(addCount(item.id))}}>+</button>
                                    </div>

                                </div>
                                </td>
                                {
                                  item.type == "S" //현재 추가 된 메뉴가 스페셜 메뉴인가? = 현재 (스무디)
                                  ? //맞다 이번에 추가 된 메뉴는 스페셜 메뉴다.
                                  ( discount == 1 && specialdiscount == 1 //현재 모든 할인이 적용이 안되어있는가?
                                    // 할인이 없는상태
                                    ? <td><p>{(item.count * (item.price * discount * specialdiscount)).toLocaleString()}</p></td>
                                    // 할인이 하나라도 있는상태 스페셜메뉴는 스페셜할인까지 적용시켜 표시한다.
                                    : <td style={{position:'relative'}}> 
                                        <p>{(item.count * (item.price * discount * specialdiscount)).toLocaleString()}</p>
                                        <p style={{position:'absolute',top:'72px',right:'20px',color:'red',fontSize:'14px'}}>-{((item.count * (item.price))-(item.count * (item.price * discount * specialdiscount))).toLocaleString()}</p>
                                      </td>
                                    )
                                  : //아니다 이번에 추가 된 메뉴는 스페셜 메뉴가 아니다.
                                  (discount == 1 //현재 일반 할인이 적용이 안되어있는가?
                                    // 할인이 없는상태
                                    ? <td><p>{(item.count * (item.price * discount)).toLocaleString()}</p></td>
                                    // 할인이 하나라도 있는상태
                                    : <td style={{position:'relative'}}>
                                        <p>{(item.count * (item.price * discount)).toLocaleString()}</p>
                                        <p style={{position:'absolute',top:'72px',right:'20px',color:'red',fontSize:'14px'}}>-{((item.count * (item.price))-(item.count * (item.price * discount))).toLocaleString()}</p>
                                      </td>
                                    )
                                  
                                    
                                }
                              
                            </tr>
                            )

                        })
                    : <tr><td colSpan={4} style={{textAlign:"center"}}>장바구니에 상품이 없습니다.</td></tr>

                }
                  <tr>
                    <td style={{width:'100px'}}><span style={{float:"left",marginLeft:"10px"}}>총 금액</span></td>
                    <td style={{padding:0}}>
                      <DropdownButton id='dropdown-button-drop-down' drop='down' variant='secondary' title='사용가능 쿠폰'>
                        {
                          props.getmycoupon.map(function (item, i) {
                            return(
                              <React.Fragment key={i}>
                                <Dropdown.Item eventKey={i} onClick={()=>{sale(item.per, item.type)}}>{item.title} ({item.per}%)
                                  {/* <span style={{color:'#a7a7a7ff',fontFamily:'Pretendard-Light'}}> - {item.content}</span> */}
                                  </Dropdown.Item>
                                <Dropdown.Divider />
                              </React.Fragment>
                            )
                          })
                        }
                        <Dropdown.Item eventKey={props.getmycoupon.length + 1} onClick={()=>{sale(0, 1)}}>쿠폰 적용 안함</Dropdown.Item>
                        <Dropdown.Divider />
                      </DropdownButton>
                    </td>
                    <td colSpan={2}><span style={{float:"right",marginRight:"10px"}}>{totalPrice.toLocaleString()}</span></td>
                  </tr>
                </tbody>
        </Table>
    </Container>

    )
}

export default Cart;