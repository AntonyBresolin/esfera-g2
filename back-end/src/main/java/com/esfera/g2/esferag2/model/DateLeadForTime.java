package com.esfera.g2.esferag2.model;

import java.util.List;

public class DateLeadForTime {
    private List<Long> leadCount;
    private List<String> dateLead;

    public DateLeadForTime() {
    }

    public DateLeadForTime(List<Long> leadCount, List<String> dateLead) {
        this.leadCount = leadCount;
        this.dateLead = dateLead;
    }

    public List<Long> getLeadCount() {
        return leadCount;
    }

    public void setLeadCount(List<Long> leadCount) {
        this.leadCount = leadCount;
    }

    public List<String> getDateLead() {
        return dateLead;
    }

    public void setDateLead(List<String> dateLead) {
        this.dateLead = dateLead;
    }
}
