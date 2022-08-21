

import React from "react";
import PropTypes from "prop-types";
import WidgetContainer from "../../containers/WidgetContainer";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  ClickAwayListener,
  // eslint-disable-next-line no-unused-vars
  Link,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowForward from "@material-ui/icons/ArrowForward";
import InfoIcon from "../../styles/icons/info-icon.svg";
import LinearStepper from "../lower-level/LinearStepper";
import CommonPageStyle from "./CommonPage.style";
import PaymentDetailsPageStyle from "./PaymentDetailsPage.style";
import RideDetailsSummary from "../higher-level/RideDetailsSummary";
import ServiceDetailsSummary from "../higher-level/ServiceDetailsSummary";
import FlightDetailsSummary from "../higher-level/FlightDetailsSummary";
import PassengerDetailsSummary from "../higher-level/PassengerDetailsSummary";
import TotalDetailsSummary from "../higher-level/TotalDetailsSummary";
import * as constants from "../../constants/Constants";
import DiscardModal from "../modals/DiscardModal";
import { DataServiceFactory } from "../../dataservices/DataServiceFactory";
import { getFirstName, getLastName, getUserId, hasActiveSession } from "../../utils/sessionUtil";
import { getStops } from '../../utils/rideUtil';
import RideSummaryModal from "../modals/RideSummaryModal";
import StickyTotalSummary from "../higher-level/StickyTotalSummary";
import { push } from "../../utils/gtmUtil";
import * as gtmConstants from "../../constants/GtmConstants";
import * as gaConstants from "../../constants/GaConstants";
import initialState from '../../reducers/InitialState';
import { getTotalCost } from '../../utils/totalCostUtil';
import { setStepsByAddons } from '../../utils/addOnsUtil';
import { trackPurchase } from "../../utils/gaUtil";
import DiscountIconImage from "../../styles/icons/icon-discount-default.svg";
import ExitIconImage from "../../styles/icons/icon-exit-subtle.svg";
import IconButton from "@material-ui/core/IconButton";
import { convertHoursToSeconds, getDifferenceHours } from "../../utils/timeUtil";

const stringUtils = require("underscore.string");
const creditCardUtils = require("creditcardutils");
const expirationDateUtils = require("cc-expiry");

const DiscountIcon = () => (
    <img
        width="24px"
        height="24px"
        src={DiscountIconImage}
        alt="users"
    />
);
const ExitIcon = () => (
    <img
        width="24px"
        height="24px"
        src={ExitIconImage}
        alt="close"
    />
);

const useStyles = (theme) => {
  const commonStyle = CommonPageStyle(theme);
  const pageStyle = PaymentDetailsPageStyle(theme);
  return { ...commonStyle, ...pageStyle };
};

class DisplayPaymentDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    let cardholderName = hasActiveSession() ? `${getFirstName()} ${getLastName()}` : '';
    if (stringUtils.isBlank(cardholderName) && this.props.passengerDetails.firstName && this.props.passengerDetails.lastName) {
      cardholderName = `${this.props.passengerDetails.firstName} ${this.props.passengerDetails.lastName}`;
    }
    this.state = {
      cardholderName,
      cardNumber: "",
      expiration: "",
      cvc: "",
      formErrors: {},
      formHasErrors: false,
      tooltipOpen: false,
      previousPage: "",
      summaryModalOpen: false,
      discardConfirmOpen: false,
      emptyGlobalState: true,
      paymentCards: [],
      cardPayload: {},
      totalCost:{},
      couponCode: "",
      discount:null,
      couponDiscount:0,
      actualCouponCode:null,
      querystring: this.props.location.search == undefined ? "":this.props.location.search ,
    };

    this.dataServiceFactory = new DataServiceFactory();
    this.dataService = this.dataServiceFactory.getDataService();
    this._handleError = this._handleError.bind(this);
    this._handleSuccess = this._handleSuccess.bind(this);
    this._loadPaymentCards = this._loadPaymentCards.bind(this);
    this._openTooltip = this._openTooltip.bind(this);
    this._closeTooltip = this._closeTooltip.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleCardNumberChange = this._handleCardNumberChange.bind(this);
    this._handleExpirationDateChange = this._handleExpirationDateChange.bind(
      this
    );
    this._validateForm = this._validateForm.bind(this);
    this._onContinue = this._onContinue.bind(this);
    this._getRider = this._getRider.bind(this);
    this._getPayer = this._getPayer.bind(this);
    this._getAdditionalPassengers = this._getAdditionalPassengers.bind(this);
    this._createPaymentCard = this._createPaymentCard.bind(this);
    this._setPrimaryCard = this._setPrimaryCard.bind(this);
    this._createRide = this._createRide.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._onDiscard = this._onDiscard.bind(this);
    this._handleDiscardCancelClick = this._handleDiscardCancelClick.bind(this);
    this._handleDiscardConfirmClick = this._handleDiscardConfirmClick.bind(
      this
    );
    this._applyCouponCode = this._applyCouponCode.bind(this);
    this._removeCoupon  =  this._removeCoupon.bind(this);

  }

  componentDidMount() {
    window.onbeforeunload = () => { };
    if (this.props.rideDetails.fromAddress !== "" && this.props.rideDetails.pickUpDate !== null && this.props.rideDetails.pickUpTime !== null) {
      window.scrollTo(0, 0);
      const queryparameter = this.state.queryString == undefined ? this.props.location.search : this.state.queryString;
      push(gtmConstants.GTM_PAGE_PAYMENT_DETAILS + queryparameter, gtmConstants.GTM_PAGE_TITLE_PAYMENT_DETAILS);

      if(process.env.ENABLE_LOAD_USERS_PAYMENT_CARD){
        this.setState({ emptyGlobalState: false }, this._loadPaymentCards);
      }
      else{
        this.setState({ emptyGlobalState: false });
      }

      const couponCode =  this.props.rideDetails.couponCode;
      if (couponCode) {
        this.setState({ couponCode, actualCouponCode:couponCode });
      }

      const discount = this.props.serviceDetails.serviceLevel.discount ? this.props.serviceDetails.serviceLevel.discount : 0;
      const couponDiscount =  this.props.serviceDetails.serviceLevel.couponDiscount ? this.props.serviceDetails.serviceLevel.couponDiscount : 0;
      const totalCost = getTotalCost(null, this.props.serviceDetails.serviceLevel.quote, this.props.serviceDetails.serviceLevel.tax, this.props.serviceDetails.serviceLevel.discount);
     
      this.setState({ discount, couponDiscount, totalCost });
    } else {
      this.props.setRideDetails({ rideDetails: initialState.rideDetails });
      this.props.setServiceDetails({ serviceDetails: initialState.serviceDetails });
      this.props.setPassengerDetails({ passengerDetails: initialState.passengerDetails });
      this.props.setPaymentDetails({ paymentDetails: initialState.paymentDetails });
      this.props.history.push({
        pathname: constants.ROUTE_RIDE_DETAILS,
        search: this.state.querystring
      });
    }
  }

  componentDidUpdate() {
    window.onbeforeunload = function (event) {
      var msg = constants.RELOAD_WARNING_TEXT;
      event.preventDefault();
      event.returnValue = msg;
      return msg;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  _handleError(errorMessage) {
    const globalNotification = {
      open: true,
      type: constants.NOTIFICATION_TYPE_ERROR,
      content: errorMessage,
      autoDismissDuration: constants.DEFAULT_AUTO_DISMISS_DURATION,
    };
    this.props.setGlobalNotification({ globalNotification });
  }

  _handleSuccess(successMessage) {
    const globalNotification = {
      open: true,
      type: constants.NOTIFICATION_TYPE_SUCCESS,
      content: successMessage,
      autoDismissDuration: constants.DEFAULT_AUTO_DISMISS_DURATION,
    };
    this.props.setGlobalNotification({ globalNotification });
  }

  _loadPaymentCards() {
    this.props.setIsLoading({ isLoading: true });
    this.dataService.getPaymentCards(this._getPayer()).then((paymentCards) => {
      this.setState({ paymentCards });
      this.props.setIsLoading({ isLoading: false });
    }).catch((error) => {
      this.props.setIsLoading({ isLoading: false });
      this._handleError(error.message);
    });
  }

  _openTooltip() {
    this.setState({ tooltipOpen: true });
  }

  _closeTooltip() {
    this.setState({ tooltipOpen: false });
  }

  _removeCoupon(){
    this.setState({couponCode:"",discount:null,couponDiscount:null,actualCouponCode:null,},this._applyCouponCode)
  }

  _applyCouponCode() {
    let formHasErrors = false;
    let formErrors = {};
    this.setState({ formHasErrors, formErrors });

    let couponDiscount = this.state.couponDiscount;
    const actualCouponCode = this.state.couponCode;

    this.props.setIsLoading({ isLoading: true });
    this.dataService.getQuote(this.props.rideDetails.fromAddress, this.props.rideDetails.fromCoordinates, this.props.rideDetails.toAddress, this.props.rideDetails.toCoordinates, this.props.rideDetails.pickUpDate, this.props.rideDetails.pickUpTime, this.props.rideDetails.duration, this.props.rideDetails.numberOfPassengers, this.props.rideDetails.amountOfLuggage, this.props.serviceDetails.serviceLevel.serviceLevelId, this.props.serviceDetails.serviceLevel.group, this.state.couponCode).then((quote) => {

      if(quote.discount > 0 || !this.state.couponCode) {
        const quoteTotal = quote.total / 100;
        const quoteTax = quote.tax / 100;
        const quoteDiscount = quote.discount / 100;
        const totalCost = getTotalCost(null, quoteTotal, quoteTax, quoteDiscount);

        const currentRideDetails = this.props.rideDetails;
        const rideDetails = {
          ...currentRideDetails,
          couponCode: this.state.couponCode
        };
        this.props.setRideDetails({ rideDetails });

        const currentServiceDetails = this.props.serviceDetails;
        const currentServiceLevel = currentServiceDetails.serviceLevel;
        const serviceLevel = {
          ...currentServiceLevel,
          quote: quoteTotal,
          quoteId: quote._id,
          tax: quoteTax,
          discount: quoteDiscount,
        };
        const serviceDetails = {
          ...currentServiceDetails,
          serviceLevel
        };
        this.props.setServiceDetails({ serviceDetails });

        this.setState({ totalCost, discount: totalCost.discount, couponDiscount,  couponCode: '', actualCouponCode });
        this.props.setIsLoading({ isLoading: false });
       } else {
         formHasErrors = true;
         formErrors = {};
         formErrors.couponCode = constants.FORM_ERROR_COUPON_CODE_NOT_EXIST;
         this.setState({ formHasErrors, formErrors });
         this.props.setIsLoading({ isLoading: false });
       }
    }).catch((error) => {
      let formErrors = {};
      const formHasErrors = true;
      formErrors.couponCode = error;
      this.setState({ formHasErrors, formErrors });
      this.props.setIsLoading({ isLoading: false });
    });
  }

  _handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  _openSummaryModal = () => {
    this.setState({ summaryModalOpen: true });
  };

  _closeSummaryModal = () => {
    this.setState({ summaryModalOpen: false });
  };

  _handleCardNumberChange(e) {
    const { name, value } = e.target;
    const newValue = creditCardUtils.formatCardNumber(value);
    this.setState({
      [name]: newValue,
    });
  }

  _handleExpirationDateChange(e) {
    const { name, value } = e.target;
    const newValue = expirationDateUtils.format(value);
    this.setState({
      [name]: newValue,
    });
  }

  _handleDiscardCancelClick() {
    this.setState({ discardConfirmOpen: false });
  }

  _handleDiscardConfirmClick() {
    this.setState({ discardConfirmOpen: false });
    this.props.history.push({
      pathname: this.state.previousPage,
      search: this.state.querystring
    });
  }

  _validateForm() {
    let formHasErrors = false;
    let formErrors = {};

    if (stringUtils.isBlank(this.state.cardholderName)) {
      formHasErrors = true;
      formErrors.cardholderName = constants.FORM_ERROR_REQUIRED_FIELD;
    }
    if (stringUtils.isBlank(this.state.cardNumber)) {
      formHasErrors = true;
      formErrors.cardNumber = constants.FORM_ERROR_REQUIRED_FIELD;
    }
    if (!creditCardUtils.validateCardNumber(this.state.cardNumber)) {
      formHasErrors = true;
      formErrors.cardNumber = constants.FORM_ERROR_INVALID_CARD_NUMBER;
    }
    if (stringUtils.isBlank(this.state.expiration)) {
      formHasErrors = true;
      formErrors.expiration = constants.FORM_ERROR_REQUIRED_FIELD;
    } else {
      const expirationParts = this.state.expiration.split("/");
      const month = expirationParts[0];
      const year = expirationParts.length === 2 ? expirationParts[1] : null;
      if (!creditCardUtils.validateCardExpiry(month, year)) {
        formHasErrors = true;
        formErrors.expiration = constants.FORM_ERROR_INVALID_EXPIRATION_DATE;
      }
    }
    if(process.env.ENABLE_CVV_VALIDATION){
      if (stringUtils.isBlank(this.state.cvc)) {
        formHasErrors = true;
        formErrors.cvc = constants.FORM_ERROR_INVALID_CVC;
      }
    }
    if (!stringUtils.isBlank(this.state.cvc)) {
      const pattern = new RegExp(/^[0-9]{3,4}$/g);
      const isValidCvc = pattern.test(this.state.cvc);
      if (!isValidCvc) {
        formHasErrors = true;
        formErrors.cvc = constants.FORM_ERROR_INVALID_CVC;
      }
    }

    this.setState({ formHasErrors, formErrors }, this._onContinue);
  }

  _onContinue() {
    if (!this.state.formHasErrors) {
      const cardholderName = this.state.cardholderName;
      const cardNumber = this.state.cardNumber.replaceAll(" ", "");
      const expirationArray = this.state.expiration.split(" / ");
      const expMonth = expirationArray[0];
      const expYear = `20${expirationArray[1]}`;
      const cvc = this.state.cvc;
      // Check if the selected card already exists.
      const existingCard = this.state.paymentCards.find((card) => {
        let expectedBrand = creditCardUtils.parseCardType(cardNumber);
        if (expectedBrand) {
          expectedBrand = expectedBrand.toLowerCase();
        }

        if(expectedBrand === constants.CARD_ABBREVIATION_BRAND_AMERICAN_EXPRESS){
          expectedBrand = constants.CARD_BRAND_AMERICAN_EXPRESS.toLowerCase();
        }

        let expectedLastFour = cardNumber.slice(-4);
        return card.brand.toLowerCase() === expectedBrand &&
          Number(card.expiration_month) === Number(expMonth) &&
          Number(card.expiration_year) === Number(expYear) &&
          card.last_four === expectedLastFour;
      });

      const cardPayload = {
        name: cardholderName,
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc
      };

      const currentPaymentDetails = this.props.paymentDetails;
      const paymentDetails = {
        ...currentPaymentDetails,
        cardNumber
      };
      this.props.setPaymentDetails( { paymentDetails });

      const currentServiceDetails = this.props.serviceDetails;
      const currentServiceLevels = this.props.serviceDetails.serviceLevel;
      const serviceLevel = {...currentServiceLevels,...this.state.totalCost,couponDiscount:this.state.couponDiscount};
     
      const serviceDetails  = {
        ...currentServiceDetails,
        serviceLevel
      };

      this.props.setServiceDetails({serviceDetails});

      if(process.env.ENABLE_PAYMENT_METHOD_CREATION_DURING_RIDE_CREATION){
        if (existingCard) {
          let userId = this._getPayer();
          this._setPrimaryCard(userId, existingCard._id);
        } else {
          // Create the card.
          this.setState({cardPayload:cardPayload},
          this._createPaymentCard);
        }
      }else{
        this.setState({cardPayload:cardPayload},
            this._createRide);
      }
    }
  }

  _onDiscard(event, previousPage) {
    if (
      !stringUtils.isBlank(this.state.cardholderName) ||
      !stringUtils.isBlank(this.state.cardNumber) ||
      !stringUtils.isBlank(this.state.expiration) ||
      !stringUtils.isBlank(this.state.cvc)
    ) {
      this.setState({ previousPage });
      this.setState({ discardConfirmOpen: true });
    } else {
      this.props.history.push({
        pathname: previousPage,
        search: this.state.querystring
      });
    }
  }

  _getRider() {
    return this.props.guestUserId || getUserId();
  }

  _getAdditionalPassengers() {
    const totalPassengers = this.props.rideDetails.numberOfPassengers;
    const additionalPassengers = totalPassengers - 1;
    return additionalPassengers;
  }

  _getPayer() {
    return hasActiveSession() ? getUserId() : this.props.guestUserId;
  }

  _createPaymentCard() {

    let userId = this._getPayer();
    // eslint-disable-next-line no-undef
    Stripe.setPublishableKey(`${process.env.STRIPE_PUBLISHABLE_KEY}`);

    this.props.setIsLoading({ isLoading: true });
    // eslint-disable-next-line no-undef
      Stripe.card.createToken(this.state.cardPayload, (status, response) => {
        if (response.error) {
          this.props.setIsLoading({ isLoading: false });
          this._handleError(response.error.message);
        } else {
          // eslint-disable-next-line no-unused-vars
          this.dataService.createPaymentCard(userId, response.id).then((result) => {
            this._createRide();
          })
              .catch((error) => {
                this.props.setIsLoading({ isLoading: false });
                this._handleError(error.message);
              });
        }
      });


  }

  _setPrimaryCard(userId, cardId) {
    this.props.setIsLoading({ isLoading: true });
    // eslint-disable-next-line no-unused-vars
    this.dataService.setPrimaryCard(userId, cardId).then((result) => {
      this._createRide();
    }).catch((error) => {
      this.props.setIsLoading({ isLoading: false });
      this._handleError(error.message);
    });
  }

  _createRide() {
    if (process.env.ADDONS_ENABLED === true) {
      return this.props.history.push({
        pathname: constants.ROUTE_ADDONS_DETAILS,
        search: this.state.querystring
      });
    }
    const group = this.props.serviceDetails.serviceLevel.group;
    const startTime = `${this.props.rideDetails.pickUpDate} ${this.props.rideDetails.pickUpTime}`; // Example: '2021-03-25 18:00';
    const from = this.props.rideDetails.fromAddress;
    const to = this.props.rideDetails.toAddress;
    const startLoc = this.props.rideDetails.fromCoordinates;
    const destLoc = this.props.rideDetails.toCoordinates;
    const rider = {
      rider: this._getRider(),
      from,
      startLoc,
      to,
      destLoc,
      additionalPassengers: this._getAdditionalPassengers()
    };

    const addOnsList = [];
    const stops = getStops(this.props.stops);
    const riders = [rider];
    const passengers = this.props.rideDetails.numberOfPassengers;
    const luggage = this.props.rideDetails.amountOfLuggage || 0;
    const serviceLevel = this.props.serviceDetails.serviceLevel.serviceLevelId;
    const estimatedTime = this.props.rideDetails.duration ? convertHoursToSeconds(this.props.rideDetails.duration) : null;
    const quoteId = this.props.serviceDetails.serviceLevel.quoteId;
    const couponCode = this.props.rideDetails.couponCode;
    const mapUrl = this.props.rideDetails.mapUrl;

    let extrasParsed;
    let extras;
    if (!stringUtils.isBlank(this.props.rideDetails.flight.carrier) && !stringUtils.isBlank(this.props.rideDetails.flight.flightNumber) && this.props.rideDetails.flight.airportCode) {
      extrasParsed = {
        "Airport": this.props.rideDetails.flight.airportCode,
        "Airline": this.props.rideDetails.flight.carrier,
        "Flight#": this.props.rideDetails.flight.flightNumber,
        "ArrivalAirport": this.props.flightDetails.arrivalAirport,
        "DepartureAirport": this.props.flightDetails.departureAirport,
      };

      extras = {
        names: ['Airport', 'Airline', 'Flight#', 'ArrivalAirport', 'DepartureAirport'],
        values: [
          this.props.rideDetails.flight.airportCode,
          this.props.rideDetails.flight.carrier,
          this.props.rideDetails.flight.flightNumber,
          this.props.flightDetails.arrivalAirport,
          this.props.flightDetails.departureAirport
        ]
      };
    }
    else if (this.props.rideDetails.flight.airportCode) {
      extras = {
        names: ['Airport', 'Airline', 'Flight#'],
        values: [this.props.rideDetails.flight.airportCode, null, null]
      };
    }
    const isPickUpLocAirport = this.props.rideDetails.airportEnabledOnly;
    const restingTimeToPickUp = parseFloat(getDifferenceHours(new Date(),new Date(startTime)));
    const rideModel = {
      group,
      startTime,
      riders,
      passengers,
      luggage,
      serviceLevel,
      estimatedTime,
      quoteId,
      extras,
      extrasParsed,
      addOnsList,
      paymentCard:{
        cardholderName:this.state.cardPayload.name,
        cardNumber:this.state.cardPayload.number,
        expMonth:this.state.cardPayload.exp_month,
        expYear:this.state.cardPayload.exp_year,
        cvv:this.state.cardPayload.cvc
      },
      couponCode,
      stops,
      isPickUpLocAirport,
      restingTimeToPickUp,
      mapUrl,
    };

    // eslint-disable-next-line no-unused-vars
    if(process.env.DATA_SERVICE === constants.DATA_SERVICE.Kaptyn) {
      this.dataService.createQuote(
        from, startLoc, to, destLoc,
        this.props.rideDetails.pickUpDate,
        this.props.rideDetails.pickUpTime,
        this.props.rideDetails.duration,
        passengers, luggage, serviceLevel, group,
        addOnsList, couponCode
      ).then((quote) => {
        rideModel.quoteId = quote.id;
        this.dataService
          .createRide(
              rideModel
          )
          .then((ride) => {
            this.props.setRide({ ride });

            trackPurchase(gaConstants.GA_PAGE_PAYMENT_DETAILS, ride, quote, [], {
              type: this.props.rideDetails.rideType,
              duration: this.props.rideDetails.duration,
              card: this.props.paymentDetails.cardNumber,
              airline: this.props.rideDetails.flight.carrier,
              origin: this.props.flightDetails.departureAirport,
              terminal: this.props.flightDetails.arrivalTerminal,
              service: this.props.serviceDetails.serviceLevel.serviceLevelName,
              serviceId: this.props.serviceDetails.serviceLevel.serviceLevelId,
              price: this.props.serviceDetails.serviceLevel.quote,
              date: this.props.rideDetails.pickUpDate,
              time: this.props.rideDetails.pickUpTime,
              country: this.props.passengerDetails.countryCode,
              trip: this.props.isFirstTrip,
              group: this.props.serviceDetails.serviceLevel.groupName,
              luggage,
              passengers
            });

            // TODO: change the line below to transition to the booking confirmation page.
            // this._handleSuccess(
            //   `Your ride ${ride.reservationNumber} was created successfully`
            // );
            this.props.setIsLoading({ isLoading: false });
            this.props.history.push({
              pathname: constants.ROUTE_BOOKING_CONFIRMATION,
              search: this.state.querystring
            });
          })
          .catch((error) => {
            this.props.setIsLoading({ isLoading: false });
            this._handleError(error.message);
          })
      })
      .catch((error) => {
          this.props.setIsLoading({ isLoading: false });
          this._handleError(error.message);
      });
    } else if (process.env.DATA_SERVICE === constants.DATA_SERVICE.SantaCruz) {
      this.dataService
      .createRide(
          rideModel
      )
      .then((ride) => {
        this.props.setRide({ ride });
        // TODO: change the line below to transition to the booking confirmation page.
        // this._handleSuccess(
        //   `Your ride ${ride.reservationNumber} was created successfully`
        // );
        this.props.setIsLoading({ isLoading: false });
        this.props.history.push({
          pathname: constants.ROUTE_BOOKING_CONFIRMATION,
          search: this.state.querystring
        });
      })
      .catch((error) => {
        this.props.setIsLoading({ isLoading: false });
        this._handleError(error.message);
      })
    }
  }

  _renderContent(classes) {
    return (
      <Grid container spacing={3} className={classes.contentContainer}>
        <Grid item xs={12} md={10}>
          <TextField
            id="cardholder-name"
            name="cardholderName"
            label="Cardholder's name"
            value={this.state.cardholderName}
            onChange={this._handleChange}
            error={!!this.state.formErrors.cardholderName}
            helperText={this.state.formErrors.cardholderName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={10}>
          <TextField
            id="card-number"
            name="cardNumber"
            label="Card number"
            value={this.state.cardNumber}
            onChange={this._handleCardNumberChange}
            error={!!this.state.formErrors.cardNumber}
            helperText={this.state.formErrors.cardNumber}
            inputProps={{ inputMode: "numeric" }}
            fullWidth
          />
        </Grid>
        <Grid item md={2} className={classes.itemBreak}>
          {/* Intentionally do nothing */}
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            id="expiration"
            name="expiration"
            label="Expiration (MM/YY)"
            value={this.state.expiration}
            onChange={this._handleExpirationDateChange}
            error={!!this.state.formErrors.expiration}
            helperText={this.state.formErrors.expiration}
            inputProps={{ inputMode: "numeric" }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            id="cvc"
            name="cvc"
            label="Security code (CVV)"
            value={this.state.cvc}
            onChange={this._handleChange}
            error={!!this.state.formErrors.cvc}
            helperText={this.state.formErrors.cvc}
            inputProps={{ inputMode: "numeric" }}
            InputProps={{
              inputMode: "numeric",
              endAdornment: (
                <InputAdornment position="end">
                  <ClickAwayListener onClickAway={this._closeTooltip}>
                    <div className={classes.info}>
                      <Tooltip
                        arrow
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={this._closeTooltip}
                        open={this.state.tooltipOpen}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                          <React.Fragment>
                            <Typography className={classes.infoText}>
                              3-digit security code is
                            </Typography>
                            <Typography className={classes.infoText}>
                              usually found on the back
                            </Typography>
                            <Typography className={classes.infoText}>
                              of your card. AMEX has a{" "}
                            </Typography>
                            <Typography className={classes.infoText}>
                              4-digit code on the front.
                            </Typography>
                          </React.Fragment>
                        }
                        placement="right"
                      >
                        <img src={InfoIcon} onClick={this._openTooltip} alt="info-icon"/>
                      </Tooltip>
                    </div>
                  </ClickAwayListener>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        {process.env.PROMO_CODE_ENABLED && (
          <Grid item container xs={12} md={12}>
            <Grid item xs={12} md={10}>
              <TextField
                id="cupon-code"
                name="couponCode"
                label="Enter promo code here"
                value={this.state.couponCode}
                error={!!this.state.formErrors.couponCode}
                helperText={this.state.formErrors.couponCode}
                onChange={this._handleChange}
                InputProps={{ endAdornment: <Button className={classes.applyButton} onClick={this._applyCouponCode} variant="contained" color="primary" disableElevation disabled={!this.state.couponCode}> Apply</Button> }}
                fullWidth
              />
            </Grid >
            <Grid item xs={4} sm={3} md={4}>
              {this.state.actualCouponCode &&  this.state.totalCost.discount && this.state.totalCost.discount > 0  &&(
                <Grid item container className={classes.promoCodeBox}>
                  <Grid item xs={2} className={classes.promocodeBoxDiscountIconContainer}><DiscountIcon /> </Grid>
                  <Grid item xs={7} className={classes.promocodeBoxLabelContainer}>  <Typography className={classes.promocodeBoxLabel}>{this.state.actualCouponCode} </Typography> </Grid>
                  <Grid item xs={2} className={classes.promocodeBoxCloseIconContainer}>
                    <IconButton  color="primary" onClick={this._removeCoupon} >
                      <ExitIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        {process.env.ENABLE_PAYMENT_TERMS_AND_CONDITIONS &&(
        <Grid item xs={12} md={6}>
          <Typography className={classes.tocsText}>
            By booking your reservation, you accept our{" "}
            <Link href= {process.env.TERM_PAGE_URL} underline="always" className={classes.link}>
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href={process.env.PRIVACY_POLICY_PAGE_URL} underline="always" className={classes.link}>
              Privacy Policy
            </Link>
            .
          </Typography>
        </Grid>)}
      </Grid>
    );
  }

  _renderSummary(classes) {
    return (
      <Grid item container md={5} className={classes.summaryContainer}>
        <Grid item xs={12} className={classes.totalDetailsContainer}>
          <TotalDetailsSummary
            totalCost={this.state.totalCost.total}
            basePriceFee={this.state.totalCost.basePriceFee}
            salesTax={this.state.totalCost.salesTax}
            discount={this.state.totalCost.discount}
            feesNote={constants.FEES_NOTE}
            addOnsEnable={process.env.ADDONS_ENABLED}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.summarySeparator} />
        </Grid>
        <Grid item xs={12} className={classes.serviceDetailsContainer}>
          <ServiceDetailsSummary
            serviceLevelId={this.props.serviceDetails.serviceLevel.serviceLevelId}
            serviceLevelName={this.props.serviceDetails.serviceLevel.serviceLevelName}
            serviceLevelDescription={this.props.serviceDetails.serviceLevel.serviceLevelDescription}
            quote={this.props.serviceDetails.serviceLevel.quote}
            onEdit={(event) => this._onDiscard(event, constants.ROUTE_SERVICE_DETAILS)}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.summarySeparator} />
        </Grid>
        {!stringUtils.isBlank(this.props.rideDetails.flight.flightNumber) && (
            <Grid item xs={12} className={classes.flightDetailsContainer}>
              <FlightDetailsSummary
                  departureTime={this.props.flightDetails.departureTime}
                  departureCity={this.props.flightDetails.departureCity}
                  departureAirport={this.props.flightDetails.departureAirport}
                  arrivalTime={this.props.flightDetails.arrivalTime}
                  arrivalCity={this.props.flightDetails.arrivalCity}
                  arrivalAirport={this.props.flightDetails.arrivalAirport}
                  arrivalTerminal={this.props.flightDetails.arrivalTerminal}
                  airline={this.props.rideDetails.flight.airline}
                  flightNumber={this.props.rideDetails.flight.flightNumber}
                  flightDetailsAvailable={this.props.flightDetails.flightDetailsAvailable}
                  onEdit={(event) => this._onDiscard(event, constants.ROUTE_FLIGHT_DETAILS)}
              />
            </Grid>
        )}
        {!stringUtils.isBlank(this.props.rideDetails.flight.flightNumber) && (
            <Grid item xs={12}>
              <div className={classes.summarySeparator} />
            </Grid>
        )}
        <Grid item xs={12} className={classes.passengerDetailsContainer}>
          <PassengerDetailsSummary
            passengerFirstName={this.props.passengerDetails.firstName}
            passengerLastName={this.props.passengerDetails.lastName}
            numberOfPassengers={this.props.rideDetails.numberOfPassengers}
            amountOfLuggage={this.props.rideDetails.amountOfLuggage}
            onEdit={(event) => this._onDiscard(event, constants.ROUTE_PASSENGER_DETAILS)}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.summarySeparator} />
        </Grid>
        <Grid item xs={12} className={classes.summaryTitleContainer}>
          <Typography className={classes.summaryTitle}>Ride details</Typography>
        </Grid>
        <Grid item xs={12} className={classes.rideDetailsContainer}>
          <RideDetailsSummary
            bookingDate={this.props.rideDetails.pickUpDate}
            bookingTime={this.props.rideDetails.pickUpTime}
            fromAddress={this.props.rideDetails.fromAddress}
            toAddress={this.props.rideDetails.toAddress}
            rideType={this.props.rideDetails.rideType}
            fromCoordinates={this.props.rideDetails.fromCoordinates}
            toCoordinates={this.props.rideDetails.toCoordinates}
            stops={this.props.stops}
            onEdit={(event) => this._onDiscard(event, constants.ROUTE_RIDE_DETAILS)}
            mapURL={this.props.rideDetails.mapUrl}
          />
        </Grid>
      </Grid>
    );
  }

  _renderLinearStepper = () => {
    let steps = constants.RIDE_STEPS.slice(0);
    let current = 4;

    if (!this.props.rideDetails.airportEnabledOnly) {
      current = 3;
      steps = steps.filter(item => item !== constants.STEP_FLIGHT);
    }

    steps = setStepsByAddons(steps, process.env.ADDONS_ENABLED);

    return (
      <LinearStepper
        steps={steps}
        currentStep={current}
      />);
  }

  render() {
    const { classes } = this.props;
    if (!this.state.emptyGlobalState) {
      return (
        <div className={classes.root}>
          {/* Sticky Ride Summary button */}
          <StickyTotalSummary
              total={this.state.totalCost.total}
              onClick={this._openSummaryModal}
          />
          <Grid container className={classes.mainContainer}>
            {/* Stepper row */}
            <Grid item xs={12} md={7} className={classes.stepperContainer} >
              {this._renderLinearStepper()}
            </Grid>
            <Grid item xs={12} md={5}>
              {/* Empty space left intentionally to accommodate the stepper */}
            </Grid>
            {/* View Ride Summary button */}
            <Grid item xs={12} className={classes.summaryButtonContainer}>
              <Button
                onClick={this._openSummaryModal}
                className={classes.summaryButton}
                variant="outlined"
              >
                <KeyboardArrowDownIcon /> View Ride Summary
              </Button>
            </Grid>
            {/* Details */}
            <Grid item container>
              {/* Left */}
              <Grid item xs={12} md={7}>
                <Grid container direction="column">
                  {/* Title */}
                  <Grid item xs={12} className={classes.titleContainer}>
                    <Typography className={classes.title}>
                      Payment Details
                    </Typography>
                  </Grid>
                  {/* Description */}
                  <Grid
                    item
                    xs={12}
                    md={9}
                    className={classes.descriptionContainer}>
                    <Typography className={classes.description}>
                      How would you like to pay?
                    </Typography>
                  </Grid>
                  {/* --------------------------------------------------- Content starts here --------------------------------------------------- */}
                  {this._renderContent(classes)}
                  {/* --------------------------------------------------- Content ends here --------------------------------------------------- */}
                  <Grid item xs={12} className={classes.buttonsContainer}>
                    <Button
                      onClick={(event) => this._onDiscard(event, constants.ROUTE_PASSENGER_DETAILS)}
                      className={classes.goBackButton}
                      variant="outlined"
                    >
                      Go back
                    </Button>
                    <Button
                      onClick={this._validateForm}
                      className={`${classes.goNextButton} payment-book-reservation`}
                      startIcon={<ArrowForward />}
                      variant="contained"
                      color="primary"
                      disableElevation
                      id={"payment-book-reservation"}
                    >
                      Book reservation now
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {/* Right */}
              {this._renderSummary(classes)}
            </Grid>
          </Grid>
          <DiscardModal
            open={this.state.discardConfirmOpen}
            handleDiscardCancelClick={this._handleDiscardCancelClick}
            handleDiscardConfirmClick={this._handleDiscardConfirmClick}
            modalTitle={"payment"}
          />
          <RideSummaryModal
            open={this.state.summaryModalOpen}
            onClose={this._closeSummaryModal}
            content={this._renderSummary(classes)}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

DisplayPaymentDetailsPage.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  globalNotification: PropTypes.object.isRequired,
  setGlobalNotification: PropTypes.func.isRequired,
  isConcierge: PropTypes.bool.isRequired,
  setIsConcierge: PropTypes.func.isRequired,
  conciergeUserId: PropTypes.string,
  setConciergeUserId: PropTypes.func.isRequired,
  continueAsGuest: PropTypes.bool.isRequired,
  setContinueAsGuest: PropTypes.func.isRequired,
  guestUserId: PropTypes.string,
  setGuestUserId: PropTypes.func.isRequired,
  rideDetails: PropTypes.object.isRequired,
  setRideDetails: PropTypes.func.isRequired,
  flightDetails: PropTypes.object.isRequired,
  setFlightDetails: PropTypes.func.isRequired,
  serviceDetails: PropTypes.object.isRequired,
  setServiceDetails: PropTypes.func.isRequired,
  passengerDetails: PropTypes.object.isRequired,
  setPassengerDetails: PropTypes.func.isRequired,
  paymentDetails: PropTypes.object.isRequired,
  setPaymentDetails: PropTypes.func.isRequired,
  ride: PropTypes.object,
  setRide: PropTypes.func.isRequired,
  stops: PropTypes.array.isRequired,
  isFirstTrip: PropTypes.bool.isRequired,
  setIsFirstTrip: PropTypes.func.isRequired,
  duplicateOrder: PropTypes.bool.isRequired,
  setDuplicateOrder: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

const PaymentDetailsPage = WidgetContainer()(DisplayPaymentDetailsPage);

export default withStyles(useStyles)(PaymentDetailsPage);
