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
    DOM.$deleteCardButton = $('.card > button.delete');
  }

  function createTabs() {
    $('.dialog').tabs();
  }

  function dialog() {
    $('.dialog').dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 300
      },
      hide: {
        effect: "explode",
        duration: 1200
      },
      buttons: {
        click: function () {
          let $setDate = $('.date').val();
          let $title = $(this).find('.inputvalue').val();
          $(this).dialog('close');
          createList($title, $setDate);
        }
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
    DOM.$deleteCardButton.on('click', deleteCard);
    DOM.$board.on('submit', 'form.new-card', createCard);
    DOM.$board.on('click', '.card > button.delete', deleteCard);
    DOM.$board.on('click', '.list-header > button.delete', deleteList);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(title, date) {
    event.preventDefault();
    $('.column:last')
      .before(`<div class="column">
      <div class="list">
            <div class="list-header">
                ${title} 
                <button class="button delete">X</button>
                ${date}
            </div>
            <ul class="list-cards">
                <li class="add-new">
                    <form class="new-card" action="index.html">
                        <input type="text" name="title" class="inputvalue" placeholder="Please name the card" />
                        <button class="button add">Add new card</button>
                    </form>
                </li>
            </ul>
        </div>
    </div>`);
    deleteList();
  };

  function deleteList() {
    $(this).closest('.column').remove();
  }


  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function dragCards() {
    $(".list-cards").sortable({
      connectWith: '.list-cards',
    })
    $('.board').sortable({})
  }

  function datePicker() {
    $(".date").datepicker();
  }

  function createCard(event) {
    event.preventDefault();

    let newItem = $(this).find('.inputvalue').val();
    $(this).closest('.add-new').before($('<li class="card ui-sortable">' + newItem + '<button class="button delete">X</button></li>')).sortable({
      connectWith: '.list-cards'
    })
    $('.card > button.delete').on('click', deleteCard)
    dragCards();
  }

  function deleteCard() {
    $(this).closest('.card').remove();
  }

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    myWidget()
    dialog();
    datePicker();
    dragCards();
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    bindEvents();
  }

  function myWidget() {
    $.widget("trello.tolgas", {
      _create: function () {
        this._button = $("<button>");
        this._button.text("Add New List");
        $(this.element).append(this._button);
        this._button.addClass("open")
      }
    })
    $('.wrap').tolgas()
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