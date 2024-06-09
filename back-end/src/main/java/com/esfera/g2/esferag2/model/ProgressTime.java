package com.esfera.g2.esferag2.model;

public class ProgressTime {
    private DateLeadForTime dateLeadForTime;
    private Double progress;

    public ProgressTime() {
    }

    public ProgressTime(DateLeadForTime dateLeadForTime, Double progress) {
        this.dateLeadForTime = dateLeadForTime;
        this.progress = progress;
    }

    public DateLeadForTime getDateLeadForTime() {
        return dateLeadForTime;
    }

    public void setDateLeadForTime(DateLeadForTime dateLeadForTime) {
        this.dateLeadForTime = dateLeadForTime;
    }

    public Double getProgress() {
        return progress;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }
}
