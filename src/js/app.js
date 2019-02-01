import $ from 'jquery';
import 'jquery-ui/themes/base/all.css';

//TODO:
//DATE PICKER

require('webpack-jquery-ui');
import '../css/styles.css';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function () {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');

    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.card > button.delete');
  }

  function createList(event) {
    event.preventDefault();

    let createLists = $(DOM.$columns).clone(true, true);
    $(createLists).prependTo('.board')
    datePicker();
    //createLists.addClass('blabla');

  }

  function createTabs() {
    $('.dialog').tabs();
  }

  function dialog() {
    $('.dialog').dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    })

    $('.open').on('click', function () {
      $('.dialog').dialog('open')
    })
  }

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);
    //DOM.$board.on('click', '.list-header > button.delete', deleteList);
    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  /* ============== Metoder för att hantera listor nedan ============== */

  function deleteList() {
    $(this).closest('.column').remove();
    console.log("This should delete the list you clicked on");
  }


  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function dragCards() {
    $(".list-cards").sortable({
      connectWith: '.list-cards'
    })
    $('.board').sortable({})
  }

  function datePicker() {
    $(".date").datepicker();
  }

  function createCard(event) {
    event.preventDefault();

    let newItem = $(this).find('.inputvalue').val();
    $(this).closest('div.list').append($('<li class="card">' + newItem + '<button class="button delete">X</button></li>').on('click', deleteCard))
    newItem.val('')

    console.log("This should create a new card");
  }

  function deleteCard() {
    $(this).closest('.card').remove();
    console.log("This should delete the card you clicked on");
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    dialog();
    datePicker();
    dragCards();
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function () {
  jtrello.init();
});