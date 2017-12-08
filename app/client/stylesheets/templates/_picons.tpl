@font-face {
    font-family: '<%= fontName %>';
    <% _.forEach(fontSrcs, function(src) { %>src: <%= src %><% }); %>;
    font-weight: normal;
    font-style: normal;
}

<%= classNames %> {
    font-family: '<%= fontName %>';
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    speak: none;
    text-transform: none;
    vertical-align: inherit;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    font-size: 1em;
}

<% _.forEach(glyphCodepointMap, function(codepoint, name) { %>
$<%= classPrefix %><%= name %>-content: '\<%= codepoint %>';
.<%= classPrefix %><%= name %>:before {
    content: $<%= classPrefix %><%= name %>-content;
}
<% }); %>
