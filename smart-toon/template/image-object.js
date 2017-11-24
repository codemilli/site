/**
 * 2017. 11. 23.
 */

var ImageObjectTmpl = _.template(`
  <div class="image-object" 
       style="top: <%= top %>px;left: <%= left %>px;width: <%= width %>px;height: <%= height %>px;z-index: <%= priority %>;">
    <img style="" src="<%= imageUrl %>" alt="image object" />
  </div>
`)
