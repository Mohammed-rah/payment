const colors = require(`../../styles/colors/${process.env.THEME}/colors.scss`);

const PaymentDetailsPageStyle = (theme) => ({
    contentContainer: {
    },
    totalDetailsContainer: {
        border: "1px solid #f3f3f3",
    },
    itemBreak: {
        [theme.breakpoints.up("xs")]: {
            display: "none",
        },
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    info: {
        padding: 10,
        cursor: "pointer",
    },
    infoText: {
        fontSize: "12px",
    },
    tocsText: {
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.25px",
        color: colors.secondaryTextColor,
    },
    link: {
        color: colors.secondaryTextColor,
    },
    applyButton: {
        borderRadius: 0,
        margin: "4px",
        padding: "2px",
    },
    promoCodeTitle: {
        margin: "24px 0px 0px 0px",
        fontSize: "20px",
        color: colors.secondaryMainColor,
      },
    promoCodeBox:{
        width: "200px",
        height: "40px",
        backgroundColor:"#f2f2f2",
        marginTop:"16px",
        alignItems: "center",
    },
    promocodeBoxLabel:{
        width: "76px",
        height: "14px",
        fontFamily: "ObjectSans",
        fontSize: "15px",
        fontWeight: "500",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "normal",
        letterSpacing: "0.47px",
        textAlign: "center",
    },
    promocodeBoxLabelContainer:{
        marginLeft: "0px",
        marginTop: "2px",
        alignItems: "center",
    },
    promocodeBoxDiscountIconContainer:{
        marginLeft: "16px",
        width: "24px",
        height: "24px",
        alignItems: "center",
    }
    ,
    promocodeBoxCloseIconContainer:{
        marginLeft: "-12px",
        marginTop: "-30px",
        width: "18px",
        height: "18px"
    }

});

export default PaymentDetailsPageStyle;