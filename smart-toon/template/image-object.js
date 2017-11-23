/**
 * 2017. 11. 23.
 */

var ImageObjectTmpl = _.template(`
  <div class="image-object" 
       style="top: <%= top %>; left: <%= left %>;z-index: <%= priority %>;">
    <img style="" src="<%= imageUrl %>" alt="image object" />
  </div>
`)
