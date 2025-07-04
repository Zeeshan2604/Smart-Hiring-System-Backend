const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

function Custome_Match_Function(Para1, Para2) {
    try {
        console.log("Custome_Match_Function called with:");
        console.log("Para1:", Para1);
        console.log("Para2:", Para2);
        
        if (!Para1 || !Para2) {
            console.log("One or both parameters are empty, returning 0");
            return 0;
        }
        
        // Ensure both parameters are strings
        const str1 = String(Para1);
        const str2 = String(Para2);
        
        console.log("Converted to strings:");
        console.log("str1:", str1);
        console.log("str2:", str2);
        
        // Tokenize and normalize both paragraphs
        const tokens1 = tokenizer.tokenize(str1.toLowerCase());
        const tokens2 = tokenizer.tokenize(str2.toLowerCase());
        
        console.log("Tokenized results:");
        console.log("tokens1:", tokens1);
        console.log("tokens2:", tokens2);

        // Expanded stop words list
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
            'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'i', 'you', 'he', 'she', 'it', 'we',
            'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours',
            'hers', 'ours', 'theirs', 'this', 'that', 'these', 'those', 'who', 'whom', 'whose', 'which', 'what',
            'where', 'when', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
            'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
            'just', 'don', 'should', 'now'
        ]);

        // Filter tokens but keep more words
        const filteredTokens1 = tokens1.filter(token => token.length > 1 && !stopWords.has(token));
        const filteredTokens2 = tokens2.filter(token => token.length > 1 && !stopWords.has(token));
        
        console.log("Filtered tokens:");
        console.log("filteredTokens1:", filteredTokens1);
        console.log("filteredTokens2:", filteredTokens2);

        // Calculate TF-IDF with lower threshold
        const tfidf = new TfIdf();
        tfidf.addDocument(filteredTokens1);
        tfidf.addDocument(filteredTokens2);

        // Get important terms with lower threshold
        const importantTerms1 = new Set();
        const importantTerms2 = new Set();

        tfidf.listTerms(0).forEach(item => {
            if (item.tfidf > 0.05) importantTerms1.add(item.term);
        });

        tfidf.listTerms(1).forEach(item => {
            if (item.tfidf > 0.05) importantTerms2.add(item.term);
        });
        
        console.log("Important terms:");
        console.log("importantTerms1:", Array.from(importantTerms1));
        console.log("importantTerms2:", Array.from(importantTerms2));

        // Calculate similarity using Jaccard similarity
        const intersection = new Set([...importantTerms1].filter(x => importantTerms2.has(x)));
        const union = new Set([...importantTerms1, ...importantTerms2]);
        const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;
        
        console.log("Jaccard similarity:", jaccardSimilarity);

        // Calculate word overlap with partial matching
        const wordOverlap = filteredTokens1.filter(token => 
            filteredTokens2.some(t => 
                natural.LevenshteinDistance(token, t) <= 2 || 
                token.includes(t) || 
                t.includes(token)
            )
        ).length;
        const maxWords = Math.max(filteredTokens1.length, filteredTokens2.length);
        const wordOverlapScore = maxWords > 0 ? wordOverlap / maxWords : 0;
        
        console.log("Word overlap score:", wordOverlapScore);

        // Calculate semantic similarity using Levenshtein distance with normalization
        const levenshteinDistance = natural.LevenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        const levenshteinScore = maxLength > 0 ? 1 - (levenshteinDistance / maxLength) : 0;
        
        console.log("Levenshtein score:", levenshteinScore);

        // Combine scores with adjusted weights
        const finalScore = (
            jaccardSimilarity * 0.3 +      // Reduced weight for exact matches
            wordOverlapScore * 0.4 +       // Increased weight for partial matches
            levenshteinScore * 0.3         // Keep semantic similarity weight
        ) * 100;
        
        console.log("Final score before bonus:", finalScore);

        // Apply a bonus for longer answers that maintain similarity
        const lengthBonus = Math.min(0.2, Math.max(0, 
            (Math.min(filteredTokens1.length, filteredTokens2.length) / 
            Math.max(filteredTokens1.length, filteredTokens2.length)) * 0.2
        ));

        console.log("Length bonus:", lengthBonus);

        // Ensure the final score never exceeds 100
        const result = Math.min(100, Math.round(finalScore * (1 + lengthBonus)));
        console.log("Final result:", result);
        
        return result;
    } catch (error) {
        console.log("Error in Custome_Match_Function:", error);
        console.log("Error stack:", error.stack);
        return 0;
    }
}

module.exports = {
    Custome_Match_Function,
  };
  