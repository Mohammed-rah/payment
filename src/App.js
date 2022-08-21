import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";

import Paper from "@mui/material/Paper";

import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  ClickAwayListener,
  // eslint-disable-next-line no-unused-vars
  Link,
} from "@material-ui/core";
import { Col, Container, Row } from "react-bootstrap";
import Image from "./Image";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
))(({ theme }) => ({
  
  "& .MuiPaper-root": {

    scrollbarWidth: "thin",
    maxHeight: 100,
    minHeight: 142,
    borderRadius: 10,
    marginTop: theme.spacing(1),
    minWidth: 174,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12);",
    "& .MuiMenu-list": {
      padding: "4px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
}));

const styles = (theme) => ({
  root: {
    boxSizing: "border-box",
    padding: "16px",
    width: "504px",
    height: "800px;",
    background: "#FFFFFF",
    border: "1px solid #DCDCDC",
    borderRadius: "10px",
  },
  cardinput1:{
    background:" rgba(0, 0, 0, 0)",
    border: "none",
    outline: "none",
    width:"100%"
  },
 

});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

class App extends Component {
  constructor(){
    super()
    this.state=
    {
      anchorEl:null,
      month:"Month",
      year:"Year",
      anchorYear:null
    }

  }
  handleClickYear=(event)=>{
    this.setState({anchorYear:event.currentTarget});
  }

 
    handleClick = (event) => {
this.setState({anchorEl:event.currentTarget});
    };

    handleCloseYear=()=>{
      this.setState({anchorYear:null});
    }
  
      
  handleClose =()=>{
   this.setState({anchorEl:null});
}



  
  render() {
    console.log(this.state.anchorEl)
    const open = Boolean(this.state.anchorEl);
    const { classes } = this.props;
    console.log(classes.root);
    return (
      <div className={"main"}>
        <Container className={classes.root}>
          <Row>
            <Col xs={12} className={"heading"}>
              3. Payment{" "}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className={"list_master"}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="4" width="24" height="16" rx="2" fill="#212B36"/>
<g opacity="0.01">
<rect x="2.32031" y="5.59961" width="19.35" height="12.8" fill="white"/>
</g>
<rect x="9.45117" y="7.83008" width="5.11" height="8.34" fill="#F26122"/>
<path d="M10.0009 11.9993C9.99548 10.3767 10.7322 8.84073 12.0009 7.8293C9.82735 6.12418 6.70856 6.37463 4.83492 8.40476C2.96128 10.4349 2.96128 13.5637 4.83492 15.5938C6.70856 17.624 9.82735 17.8744 12.0009 16.1693C10.7298 15.1598 9.99251 13.6225 10.0009 11.9993Z" fill="#EA1D25"/>
<path fillRule="evenodd" clipRule="evenodd" d="M20.41 15.0801V15.2901H20.3V15.2301L20.36 15.0801H20.41ZM20.2786 15.1765L20.3 15.2301V15.1301L20.2786 15.1765ZM20.24 15.0801L20.2786 15.1765L20.24 15.2601L20.18 15.1301V15.0801H20.24ZM20.07 15.1201V15.2901H20V15.1201H20.07Z" fill="#F69E1E"/>
<path d="M20.58 11.9993C20.5748 14.0272 19.415 15.875 17.5911 16.7615C15.7672 17.6479 13.5977 17.4181 12 16.1693C13.2772 15.1624 14.0226 13.6257 14.0226 11.9993C14.0226 10.3729 13.2772 8.83621 12 7.82931C13.5957 6.57209 15.7696 6.33759 17.5968 7.2256C19.4239 8.1136 20.5826 9.96784 20.58 11.9993Z" fill="#F69E1E"/>
</svg>  Mastercard 3456{" "}

            </Col>
          </Row>
          <Row>
            <Col xs={12} className={"list_add"}>
              <div>
                Add credit/debit card
                <div className="add_cr_icon">
                  {" "}
                  <svg
                    width="8"
                    height="5"
                    className="add_cr_icon"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.99992 0.333984L0.470177 3.86373C0.210462 4.12344 0.210462 4.54452 0.470177 4.80424C0.729692 5.06376 1.15038 5.06398 1.41018 4.80475L3.99992 2.22065L6.58967 4.80475C6.84946 5.06398 7.27015 5.06376 7.52967 4.80424C7.78938 4.54452 7.78938 4.12344 7.52967 3.86373L3.99992 0.333984Z"
                      fill="#3064F6"
                    />
                  </svg>
                </div>
              </div>
            </Col>
          </Row>
          <Row >
            <Col xs={12}>
             <Container className="card_number">
                 <Row>
                    <Col className="card_n_title">Card number</Col>
                 </Row>
                 <Row>
                    <Col className="card_n_input">
                        <input placeholder="XXXX XXXX XXXX XXXX" className={classes.cardinput1} type={'text'}></input>
                    </Col>
                 </Row>

             </Container>
            </Col>
          </Row>
          <Row >
            <Col xs={12} className={''}>
                <Container className="exp">
                    <Row>
                        <Col className="exp1 " xs={12}><span className="exp1Text"> Expiration date</span></Col>
                    </Row>
                    <Row className="myear" style={{height:"48px"}}>
                       <Col className="month" xs={6}  
                       style={{cursor:"pointer"}}
                     id="demo-customized-button"
                     aria-controls={open ? "demo-customized-menu" : undefined}
                     aria-haspopup="true"
                     aria-expanded={open ? "true" : undefined}
                     variant="contained"
                    
                     onClick={this.handleClick}
                        >
                       <div className="mText">{this.state.month}</div>
                       <div style={{color:"#67676F"}}><svg width="10"  height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M9.41218 0.745383C9.08779 0.420989 8.56193 0.420702 8.23718 0.744742L5 3.97487L1.76282 0.744743C1.43807 0.420703 0.912214 0.420989 0.58782 0.745383V0.745383C0.263176 1.07003 0.263176 1.59638 0.58782 1.92102L5 6.3332L9.41218 1.92102C9.73682 1.59638 9.73682 1.07003 9.41218 0.745383V0.745383Z" fill="#67676F"/>
</svg>
</div>
<StyledMenu
  id="demo-customized-menu"
  MenuListProps={{
    "aria-labelledby": "demo-customized-button"
  }}
  anchorEl={this.state.anchorEl}
  open={open}
  onBlur={this.handleClose}
      >
        {["",1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((e) => {
          return (
            <MenuItem key={e} onClick={this.handleClose}  disableRipple>
              {e}
            </MenuItem>
          );
        })}
      </StyledMenu>
                       </Col>
                       <Col className=" month" xs={6}
                        style={{cursor:"pointer"}}
                        id="demo-customized-button"
                        aria-controls={open ? "demo-customized-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        variant="contained"
                       
                        onClick={this.handleClickYear}>
                       <div className="mText">{this.state.year}</div>
                       <div style={{color:"#67676F"}}><svg width="10"  height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M9.41218 0.745383C9.08779 0.420989 8.56193 0.420702 8.23718 0.744742L5 3.97487L1.76282 0.744743C1.43807 0.420703 0.912214 0.420989 0.58782 0.745383V0.745383C0.263176 1.07003 0.263176 1.59638 0.58782 1.92102L5 6.3332L9.41218 1.92102C9.73682 1.59638 9.73682 1.07003 9.41218 0.745383V0.745383Z" fill="#67676F"/>
</svg>
</div>
<StyledMenu
  id="demo-customized-menu"
  MenuListProps={{
    "aria-labelledby": "demo-customized-button"
  }}
  anchorEl={this.state.anchorYear}
  open={Boolean(this.state.anchorYear)}
  onBlur={this.handleCloseYear}
      >
        {["",2022,2023,2024,2025,2026,2027,2028].map((e) => {
          return (
            <MenuItem key={e} onClick={this.handleCloseYear}  disableRipple>
              {e}
            </MenuItem>
          );
        })}
      </StyledMenu>
                       </Col>
                    </Row>
                    

                </Container>
            </Col>
          </Row>

          <Row >
            <Col xs={12} className={''}>
                <Container className="exp">
                    <Row>
                        <Col className="exp1 " xs={12}><span className="exp1Text">Security code</span></Col>
                    </Row>
                    <Row className="myear" style={{height:"48px"}}>
                       <Col className="cvv" xs={6}>
                        <div>
                        <input placeholder="123" className={classes.cardinput1} type={'text'}></input>
                        </div>
                        <div>
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M1.10736 4.51203C1.4328 4.1866 1.96043 4.1866 2.28587 4.51203L5.23215 7.45831L11.714 0.976499C12.0394 0.651063 12.567 0.651063 12.8925 0.9765C13.2179 1.30194 13.2179 1.82957 12.8925 2.15501L5.23215 9.81533L1.10736 5.69054C0.781922 5.36511 0.781922 4.83747 1.10736 4.51203Z" fill="#01020F"/>
</svg>

                        </div>
                
                         
                       </Col>
                      
                    </Row>
                    

                </Container>
            </Col>
          </Row>
        
       <Row>
        <Col xs={12} className="default">

       <div className="df">
       <input id="cb1" type="checkbox"  /> <label className="dfText">Set as default payment method</label>
       </div>
        </Col >
       </Row>
       <Row  style={{marginTop:"16px"}}>
            <Col xs={12} className={''}>
                <Container className="exp">
                    <Row>
                        <Col className="exp1 " xs={12}><span className="couponT"> Do you have a coupon code?</span></Col>
                    </Row>
                    <Row className="myear" style={{height:"48px",gap: "10px"}}>
                       <Col className="cpn" xs={8}>
                       <input placeholder="KAPPY20" className={classes.cardinput1} type={'text'}></input>
                       </Col>
                       <Col className="cpnbtn" xs={4} style={{cursor:"pointer"}}>
                      <span className="btnText">Apply</span> 
                       </Col>
                    </Row>
                </Container>
            </Col>
          </Row>
          <Row >
            <Col xs={12}>
             <Container className="card_number">
                 <Row>
                    <Col className="card_n_title"></Col>
                 </Row>
                 <Row>
                    <Col style={{cursor:"pointer"}} className="btnB">
                      <div className="df">
                      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M3.33334 4.83366C3.33334 2.53247 5.19882 0.666992 7.5 0.666992C9.80119 0.666992 11.6667 2.53247 11.6667 4.83366V5.66699L11.6667 5.67044C12.0816 5.67635 12.4525 5.69233 12.7732 5.73544C13.3194 5.80889 13.8431 5.97451 14.2678 6.39923C14.6925 6.82394 14.8581 7.34757 14.9316 7.89383C15.0001 8.40355 15 9.04007 15 9.77882L15 11.5591C15 12.6876 15.0001 13.6181 14.901 14.3545C14.7971 15.1277 14.5704 15.8106 14.0237 16.3573C13.4769 16.9041 12.7941 17.1307 12.0209 17.2347C11.2844 17.3337 10.3539 17.3337 9.22548 17.3337H5.77453C4.64609 17.3337 3.71558 17.3337 2.97912 17.2347C2.20593 17.1307 1.52307 16.9041 0.976315 16.3573C0.429557 15.8106 0.202917 15.1277 0.0989642 14.3545C-5.09185e-05 13.6181 -2.64776e-05 12.6876 3.02668e-06 11.5591L2.03327e-06 9.7788C-3.94913e-05 9.04006 -7.51577e-05 8.40355 0.0684544 7.89383C0.141898 7.34757 0.307519 6.82394 0.732237 6.39923C1.15696 5.97451 1.68058 5.80889 2.22684 5.73544C2.54753 5.69233 2.9184 5.67635 3.33334 5.67044L3.33334 5.66699V4.83366ZM10 4.83366V5.66699H5V4.83366C5 3.45295 6.11929 2.33366 7.5 2.33366C8.88072 2.33366 10 3.45295 10 4.83366ZM2.44892 7.38725C2.08747 7.43584 1.97419 7.5143 1.91075 7.57774C1.84731 7.64117 1.76885 7.75446 1.72026 8.11591C1.66844 8.50133 1.66667 9.02443 1.66667 9.83366V11.5003C1.66667 12.7024 1.66844 13.5201 1.75077 14.1325C1.82987 14.7208 1.96935 14.9934 2.15483 15.1788C2.3403 15.3643 2.61282 15.5038 3.2012 15.5829C3.81355 15.6652 4.63127 15.667 5.83334 15.667H9.16667C10.3687 15.667 11.1865 15.6652 11.7988 15.5829C12.3872 15.5038 12.6597 15.3643 12.8452 15.1788C13.0307 14.9934 13.1701 14.7208 13.2492 14.1325C13.3316 13.5201 13.3333 12.7024 13.3333 11.5003V9.83366C13.3333 9.02443 13.3316 8.50133 13.2797 8.11591C13.2312 7.75446 13.1527 7.64117 13.0893 7.57774C13.0258 7.5143 12.9125 7.43584 12.5511 7.38725C12.1657 7.33543 11.6426 7.33366 10.8333 7.33366H4.16667C3.35744 7.33366 2.83435 7.33543 2.44892 7.38725ZM7.5 13.167C8.42048 13.167 9.16667 12.4208 9.16667 11.5003C9.16667 10.5799 8.42048 9.83366 7.5 9.83366C6.57953 9.83366 5.83334 10.5799 5.83334 11.5003C5.83334 12.4208 6.57953 13.167 7.5 13.167Z" fill="white"/>
</svg>
<span className="BT">Continue</span> 

                      </div>
              
                    </Col>
                 </Row>

             </Container>
            </Col>
          </Row>
    <Row>
      <Col className="imgdf" xs={12}>
        <Image/>
      </Col>
    </Row>
       
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(App);









