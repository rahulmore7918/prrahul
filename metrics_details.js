
g.application.metricsDetails = function () {

    //private functions
	function getMetricsURLPrivate(type) {
		var urlObj =  {
			RFC: "response-for-class",
			CBO: "coupling-between-objects",
			LOC: "lines-of-code",
			DOIH: "depth-of-inheritance-hierarchy",
			CR: "comment-ratio",
			NOM: "number-of-methods",
			NOS: "number-of-statements",
			LOC_Comments: "lines-of-code-comments",
			'LOC Comments': "lines-of-code-comments",
			Maxnesting: "max-nesting",
			NOA: "number-of-attributes",
			NOPA: "number-of-public-attributes",
			NOPM:"number-of-public-attributes",
			NOAM: "number-of-accessor-methods",
			ATFD: "access-to-foreign-data",
			NOAV: "number-of-accessed-variables",
			LCOM: "lack-of-cohesion-of-methods",
			FDP: "foreign-data-providers",
			LAA: "locality-of-attribute-accesses",
			ELOC: "number-of-statements",
			CC: "cyclomatic-complexity",
			MN: "max-nesting",
			MNOP: "maximum-number-of-parameters",
			WMPC: "weighted-methods-per-class-1",
			Complexity: "cyclomatic-complexity"
		}

		var metricUrl = urlObj[type];
		return metricUrl;
	}

    //public functions
	return {
		getMetricsURL: function (type) {
			return getMetricsURLPrivate(type);
		}
	}
}(g);



























