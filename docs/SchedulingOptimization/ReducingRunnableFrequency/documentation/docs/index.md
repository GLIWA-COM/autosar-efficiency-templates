# Reducing runnable frequency

---

## Introduction

A common misinterpretaion of high CPU load / overloaded CPU is looking for functions with a high runtime. It can be seen as the low-hanging fruit as optimizing even for a fraction of the runtime might reduce the absolute runtime by a lot.
CPU load is not the result of long runtimes though, it is the product of runtime and execution frequency. 
> Long running (order of ms or tens of ms) functions called every couple seconds are far less taxing than a 100us function running every millisecond.

The below real-word scenario is meant to exemplify the importance of this idea.

## The case of mainfunctions

### About Ethernet transceivers

Clause 22 of the IEEE Ethernet standard specifies the MDIO interface frame format and timings.
The MDIO interface is one of the frequently used interfaces to configure Ethernet transceivers.
The specifications require a maximum clock speed of 2.5MHz over MDIO and a single transaction (register read/write) is 64 bits.

The theoretical maximum bandwidth is ~39k transactions per second or ~26 us/transaction.

### The problem

The AUTOSAR standards define the `EthTrcv_MainFunction` as the API which polls the transceiver for status changes.
The number of transactions to accomplish this varies by device and driver, in our example it is 6 transactions.
*[ECUC_EthTrcv_00032](https://www.autosar.org/fileadmin/standards/R24-11/CP/AUTOSAR_CP_SWS_EthernetTransceiverDriver.pdf)* defines the configuration option `EthTrcvMainFunctionPeriod` with **no default value**!


> Synchronous transactions over MDIO, however, will only depend 
> on the throughput of the MDIO line, i.e. they take the same 
> amount of time on a 50MHz as well as a 500MHz CPU.

Scheduling the `EthTrcv_MainFunction` with a short period can lead to excessive CPU load.
The table below illustrates the resulting CPU load in percentages, as a function of the mainfunction period
and the number of transactions required to obtain the register information.

<div class="center-table" markdown>

| Transactions / Period | 1ms | 2ms | 5ms | 10ms | 
|:---:|:---:|:---:|:---:|:---:|
| 3  | 8.4  | 4.2  | 1.68 | 0.84 |
| 4  | 11.2 | 5.6  | 2.24 | 1.12 |
| 5  | 14   | 7    | 2.8  | 1.4  |
| 6  | 16.8 | 8.4  | 3.36 | 1.68 |
| 8  | 22.4 | 11.2 | 4.48 | 2.24 |
| 10 | 28   | 14   | 5.6  | 2.8  |
</div>
<div class="table-caption">Effects of transceiver accesses and mainfunction period on CPU load</div>

### The solution

We recommend choosing values which are high enough to not cause significant load while still satisfying project specific state and error detection times.

<figure>
  <img src="assets/1ms period.png"/>
  <figcaption>EthTrcv_MainFunction timing parameters with 1ms period</figcaption>
</figure>
<figure>
  <img src="assets/100ms period.png"/>
  <figcaption>EthTrcv_MainFunction timing parameters with 100ms period</figcaption>
</figure>

The results speak for themselves: from ~17% CPU load to ~0.17% CPU load, with practically no loss of functionality, the transceiver status detection is acceptable at 100ms intervals.

## Summary

The example higlights the importance of choosing the right period for cyclic runnables, oftentimes, these are scheduled with a much higher frequency than required, leading to excessive CPU load.

## How-to
1. Identify all tasks with a short period / high frequency: tasks with a period of 20ms or lower are good candidates.
2. Measure the CPU load of the individual runnables and create a list in descending order of CPU load.
3. Review the period of the runnables and decide whether the runnables can be scheduled with a longer period/reduced frequency.
4. Reconfigure BSW and/or modify the application component internal behavior according to the findings of #3.
