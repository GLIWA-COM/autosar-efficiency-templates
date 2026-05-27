# AUTOSAR Efficiency Templates
The *AUTOSAR Efficiency Templates* are a set of classical AUTOSAR applications demonstrating
efficient use and configuration of an AUTOSAR stack. 'Efficiency' here relates to small flash
memory footprint as well as minimized consumption of RAM and runtime.

While the templates are built on the ETAS
RTA-CAR for the Infineon AURIX, the essential concepts can be applied to other AUTOSAR stacks
and other microcontrollers.

The following templates exist, each addressing a dedicated configuration aspect.

* [RTE implicit communication](RteImplicitCommunication/documentation/docs/index.md)
* [Reducing runnable frequency](SchedulingOptimization/ReducingRunnableFrequency/documentation/docs/index.md)
* [Stack optimization](StackOptimization/documentation/docs/index.md)
* [Calling Client/Server operations](CallingCSOperations/documentation/docs/index.md)

The AUTOSAR Efficiency Templates have been developed by [GLIWA](https://gliwa.com) and
[ETAS](https://etas.com).

## Background
The vast majority of software developers is using open-source software one way or another.
If not as part of their work, then any private maker projects will certainly involve open-source.
As a result, many aspects of open-source projects are expected to be available also in
non-open-source domains. One example of such aspects is the availability of comprehensive
examples and reference projects or reference implementations.

AUTOSAR lacks such reference projects and reference implementations and, as a result, some ECU
projects even base their initial configuration on some random demo projects following the
thought “any starting point is better than having to set things up from scratch”. As a result,
we see largely inefficient and sometimes even unsafe configurations finding their way into
even ASIL-D projects.

The AUTOSAR Efficiency Templates solve several problems at the same time and they are
available for free.

* Well-described example projects for education and as a hands-on starting point.
* Well-designed reference configuration avoiding typical AUTOSAR pitfalls. See the talk [*“Why
AUTOSAR fails so often”*](https://www.youtube.com/watch?v=kJIsEuMhOsA) by Peter Gliwa from the
15ᵗʰ AOC (AUTOSAR Open Conference) which showed that such pitfalls cost many millions of Euros
and Dollars every year.
* As the name suggests, the templates are designed to achieve a high level of efficiency in
the sense that the consumption of runtime, stack and flash is minimized.

The last topic has another aspect to it, besides being a very helpful basis for real ECU
projects. Over the past years, more and more people reported frustrating experience with
AUTOSAR. “The overhead caused by AUTOSAR is enormous” is a common statement. Few people
understand though, that AUTOSAR as such is not inefficient. The inefficiency comes with an
inefficient configuration of the AUTOSAR stack.

The Efficiency Templates not only show that efficient AUTOSAR-based projects are possible.
They also explain how this can be achieved and, hopefully, will help to correct a pessimistic
view on AUTOSAR.



