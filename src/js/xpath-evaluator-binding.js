import moment from 'moment';
import ExtendedXpathEvaluator from 'extended-xpath';
import openrosaExtensions from 'openrosa-xpath-extensions';

const translate = ( key ) => {
    if ( key.indexOf( 'date.dayofweek.' ) === 0 ) {
        return moment().weekday( key.substring( 15 ) ).format( 'ddd' );
    }
    if ( key.indexOf( 'date.month.' ) === 0 ) {
        return moment().month( parseInt( key.substring( 11 ) ) - 1 ).format( 'MMM' );
    }

    return key;
};

export default function( translator ) {
    // re-implement XPathJS ourselves!
    var evaluator = new XPathEvaluator();

    this.xml.jsCreateExpression = function() {
        return evaluator.createExpression.apply( evaluator, arguments );
    };
    this.xml.jsCreateNSResolver = function() {
        return evaluator.createNSResolver.apply( evaluator, arguments );
    };
    this.xml.jsEvaluate = function( e, contextPath, namespaceResolver, resultType, result ) {
        var extensions = openrosaExtensions( translator || translate );
        var wrappedXpathEvaluator = function( v ) {
            // Node requests (i.e. result types greater than 3 (BOOLEAN)
            // should be processed unaltered, as they are passed this
            // way from the ExtendedXpathEvaluator.  For anything else,
            // we will be ask for the most appropriate result type, and
            // handle as best we can.
            var wrappedResultType = resultType > XPathResult.BOOLEAN_TYPE ? resultType : XPathResult.ANY_TYPE;
            var doc = contextPath.ownerDocument;
            return doc.evaluate( v, contextPath, namespaceResolver, wrappedResultType, result );
        };
        var evaluator = new ExtendedXpathEvaluator( wrappedXpathEvaluator, extensions );
        return evaluator.evaluate( e, contextPath, namespaceResolver, resultType, result );
    };
    window.JsXPathException =
        window.JsXPathExpression =
        window.JsXPathNSResolver =
        window.JsXPathResult =
        window.JsXPathNamespace = true;
}
