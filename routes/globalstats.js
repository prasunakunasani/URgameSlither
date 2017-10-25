let express = require('express');
let router = express.Router();

router.get('/globalstats', function(req, res) {
        res.redirect('/stats'+'#global');
});

module.exports = router;

/*
 <% for (var i = 0; i< order.length; i++) { %>
        <div id="champ">
            <span><%= order[i].id %></span>
            <span><%= order[i].name %></span>
            <span><%= order[i].drink %></span>
        </div>
        <% } %>
 */