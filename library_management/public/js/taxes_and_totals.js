frappe.provide("erpnext.public");
frappe.provide("erpnext.controllers");

erpnext.taxes_and_totals.prototype.calculate_item_values = function () {
    var me = this;
    if (!this.discount_amount_applied) {
        for (const item of this.frm._items || []) {
            frappe.model.round_floats_in(item);
            item.net_rate = item.rate;
            console.log("::::::: library custom item.net_rate = item.rate;", item.net_rate)
            item.qty = item.qty === undefined ? (me.frm.doc.is_return ? -1 : 1) : item.qty;

            if (!(me.frm.doc.is_return || me.frm.doc.is_debit_note)) {
                item.net_amount = item.amount = flt(item.rate * item.qty, precision("amount", item));
            }
            else {
                // allow for '0' qty on Credit/Debit notes
                let qty = flt(item.qty);
                if (!qty) {
                    qty = (me.frm.doc.is_debit_note ? 1 : -1);
                    if (me.frm.doc.doctype !== "Purchase Receipt" && me.frm.doc.is_return === 1) {
                        // In case of Purchase Receipt, qty can be 0 if all items are rejected
                        qty = flt(item.qty);
                    }
                }

                if (item.customizable_uom === 'LxW') {
                    let customizable_sqm = item.customizable_length * item.customizable_width;
                    item.net_amount = item.amount = flt((item.rate * customizable_sqm) * qty, precision("amount", item));
                    item.customizable_sqm = customizable_sqm;
                    console.log("::::::: library custom customizable_sqm: ", customizable_sqm,  "item.net_amount: ", item.net_amount, "item.amount: ", item.amount )
                } else {
                    item.net_amount = item.amount = flt(item.rate * qty, precision("amount", item));
                }

            }

            item.item_tax_amount = 0.0;
            item.total_weight = flt(item.weight_per_unit * item.stock_qty);

            me.set_in_company_currency(item, ["price_list_rate", "rate", "amount", "net_rate", "net_amount"]);
        }
    }
}