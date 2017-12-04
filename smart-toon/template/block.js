/**
 * 2017. 11. 24.
 */

var BlockTmpl = _.template(`
  <div class="block" 
       style="top: <%= top %>px;left: <%= left %>px;width: <%= width %>px;height: <%= height %>px;">
    <img style="" src="<%= imageUrl %>" alt="block background" />
  </div>
`)

var EmptyBlockTmpl = _.template(`
  <div class="block" 
       style="background: <%= bgColor %>;top: <%= top %>px;left: <%= left %>px;width: <%= width %>px;height: <%= height %>px;">
  </div>
`)
