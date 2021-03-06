Quixe=function(){function quixe_prepare(image,all_options){game_image=image;var ls=game_image.slice(0,64);var ix,val;for(ix=0;ix<ls.length;ix++){val=ls[ix].toString(16);if(val.length<2)
val="0"+val;ls[ix]=val;}
game_signature=ls.join('');if(all_options){opt_rethrow_exceptions=all_options.rethrow_exceptions;}
if(all_options&&all_options.debug_info_data_chunk){parse_inform_debug_data(all_options.debug_info_data_chunk);}}
function quixe_init(){if(vm_started){Glk.fatal_error("Quixe was inited twice!");return;}
try{setup_bytestring_table();setup_operandlist_table();setup_vm();execute_loop();}
catch(ex){qstackdump();Glk.fatal_error("Quixe init: "+show_exception(ex));if(opt_rethrow_exceptions)
throw ex;}}
function quixe_resume(){try{done_executing=vm_stopped;execute_loop();}
catch(ex){qstackdump();Glk.fatal_error("Quixe run: "+show_exception(ex));if(opt_rethrow_exceptions)
throw ex;}}
function show_exception(ex){if(typeof(ex)=='string')
return ex;var res=ex.toString();if(ex.message)
res=res+' '+ex.message;if(ex.fileName)
res=res+' '+ex.fileName;if(ex.lineNumber)
res=res+' line:'+ex.lineNumber;if(ex.name)
res=res+' '+ex.name;if(ex.number)
res=res+' '+ex.number;return res;}
function qlog(msg){if(window.console&&console.log)
console.log(msg);else if(window.opera&&opera.postError)
opera.postError(msg);}
function qobjdump(obj,depth){var key,proplist;if(obj instanceof Array){if(depth)
depth--;var ls=obj.map(function(v){return qobjdump(v,depth);});return("["+ls.join(",")+"]");}
if(!(obj instanceof Object))
return(""+obj);proplist=[];for(key in obj){var val=obj[key];if(depth&&val instanceof Object)
val=qobjdump(val,depth-1);proplist.push(key+":"+val);}
return"{ "+proplist.join(", ")+" }";}
function qstackdump(){if(!stack||!stack.length)
return;var ix,val,debugfunc;var frm;var ls=[];for(ix=0;ix<stack.length;ix++){frm=stack[ix];if(!frm.vmfunc.funcaddr){ls.push("(anonymous)");continue;}
val="0x"+frm.vmfunc.funcaddr.toString(16);debugfunc=debuginfo.functionmap[frm.vmfunc.funcaddr];if(debugfunc)
val=val+(" \""+debugfunc.name+"\"");ls.push(val);}
qlog("VM stack dump: "+ls.join(", "));}
var bytestring_table=Array(256);var quotechar_table=Array(256);function setup_bytestring_table(){var ix,val;for(ix=0;ix<0x100;ix++){val=ix.toString(16);if(ix<0x10)
val="0"+val;bytestring_table[ix]=val;}
for(ix=0;ix<0x100;ix++){if(ix>=0x20&&ix<0x7f){if(ix==0x22||ix==0x27||ix==0x5c)
val="\\"+String.fromCharCode(ix);else
val=String.fromCharCode(ix);}
else if(ix==0x0a){val="\\n";}
else{val="\\x"+bytestring_table[ix];}
quotechar_table[ix]=val;}}
function ByteRead4(arr,addr){return(arr[addr]*0x1000000)+(arr[addr+1]*0x10000)
+(arr[addr+2]*0x100)+(arr[addr+3]);}
function ByteRead2(arr,addr){return(arr[addr]*0x100)+(arr[addr+1]);}
function ByteRead1(arr,addr){return arr[addr];}
function Mem1(addr){return memmap[addr];}
function Mem2(addr){return(memmap[addr]*0x100)+(memmap[addr+1]);}
function Mem4(addr){return(memmap[addr]*0x1000000)+(memmap[addr+1]*0x10000)
+(memmap[addr+2]*0x100)+(memmap[addr+3]);}
function MemW1(addr,val){memmap[addr]=val&0xFF;}
function MemW2(addr,val){memmap[addr]=(val>>8)&0xFF;memmap[addr+1]=val&0xFF;}
function MemW4(addr,val){memmap[addr]=(val>>24)&0xFF;memmap[addr+1]=(val>>16)&0xFF;memmap[addr+2]=(val>>8)&0xFF;memmap[addr+3]=val&0xFF;}
function BytePushString(arr,str){for(var ix=0;ix<str.length;ix++){arr.push(str.charCodeAt(ix));}}
function BytePush4(arr,val){arr.push((val>>24)&0xFF);arr.push((val>>16)&0xFF);arr.push((val>>8)&0xFF);arr.push(val&0xFF);}
function BytePush2(arr,val){arr.push((val>>8)&0xFF);arr.push(val&0xFF);}
function BytePush1(arr,val){arr.push(val&0xFF);}
function ByteWrite4(arr,addr,val){arr[addr]=(val>>24)&0xFF;arr[addr+1]=(val>>16)&0xFF;arr[addr+2]=(val>>8)&0xFF;arr[addr+3]=val&0xFF;}
function ByteReadString(arr,addr,len){return String.fromCharCode.apply(this,arr.slice(addr,addr+len));}
function QuoteMem1(addr){if(memmap[addr]>=0x80)
return"0xffffff"+bytestring_table[memmap[addr]];return"0x"+bytestring_table[memmap[addr]];}
function QuoteMem2(addr){if(memmap[addr]>=0x80)
return"0xffff"+bytestring_table[memmap[addr]]+bytestring_table[memmap[addr+1]];if(memmap[addr])
return"0x"+bytestring_table[memmap[addr]]+bytestring_table[memmap[addr+1]];return"0x"+bytestring_table[memmap[addr+1]];}
function QuoteMem4(addr){if(memmap[addr])
return"0x"+bytestring_table[memmap[addr]]+bytestring_table[memmap[addr+1]]+bytestring_table[memmap[addr+2]]+bytestring_table[memmap[addr+3]];if(memmap[addr+1])
return"0x"+bytestring_table[memmap[addr+1]]+bytestring_table[memmap[addr+2]]+bytestring_table[memmap[addr+3]];if(memmap[addr+2])
return"0x"+bytestring_table[memmap[addr+2]]+bytestring_table[memmap[addr+3]];return"0x"+bytestring_table[memmap[addr+3]];}
function ReadArgByte(addr){if(addr==0xffffffff)
return frame.valstack.pop()&0xFF;else
return Mem1(addr);}
function WriteArgByte(addr,val){if(addr==0xffffffff)
frame.valstack.push(val&0xFF);else
MemW1(addr,val);}
function ReadArgWord(addr){if(addr==0xffffffff)
return frame.valstack.pop();else
return Mem4(addr);}
function WriteArgWord(addr,val){if(addr==0xffffffff)
frame.valstack.push(val);else
MemW4(addr,val);}
function ReadStructField(addr,fieldnum){if(addr==0xffffffff)
return frame.valstack.pop();else
return Mem4(addr+4*fieldnum);}
function WriteStructField(addr,fieldnum,val){if(addr==0xffffffff)
frame.valstack.push(val);else
MemW4(addr+4*fieldnum,val);}
function SetResumeStore(val){resumevalue=val;}
function CharToString(val){if(val<0x10000){return String.fromCharCode(val);}
else{val-=0x10000;return String.fromCharCode(0xD800+(val>>10),0xDC00+(val&0x3FF));}}
function QuoteCharToString(val){if(val<0x100){return quotechar_table[val];}
else if(val<0x10000){val=val.toString(16);while(val.length<4)
val="0"+val;return("\\u"+val);}
else{var val2;val-=0x10000;val2=0xD800+(val>>10);val=0xDC00+(val&0x3FF);return("\\u"+val2.toString(16)+"\\u"+val.toString(16));}}
function QuoteStr1ToString(val){return QuoteCharToString(val.charCodeAt(0));}
var regexp_string_unsafe=/[^a-zA-Z0-9 .,;:?!=_+()-]/g;function QuoteEscapeString(val){val=val.replace(regexp_string_unsafe,QuoteStr1ToString);return'"'+val+'"';}
function fatal_error(msg){var ix,val;if(arguments.length>1){msg+=" (";for(ix=1;ix<arguments.length;ix++){val=arguments[ix];if(typeof(val)=='number'){val=val.toString(16);}
else{val=""+val;}
if(ix!=1)
msg+=" ";msg+=val;}
msg+=")";}
qlog(msg);throw(msg);}
function make_code(val,arg){if(arg===undefined)
eval("function _func() {\n"+val+"\n}");else
eval("function _func("+arg+") {\n"+val+"\n}");return _func;}
function VMFunc(funcaddr,startpc,localsformat,rawformat){if(!funcaddr){this.funcaddr=null;this.startpc=null;this.functype=null;}
else{this.funcaddr=funcaddr;this.startpc=startpc;this.functype=Mem1(funcaddr);}
this.pathaddrs={};this[0]={};this[1]={};this[2]={};this.locallen=null;this.localsformat=localsformat;this.rawformat=rawformat;this.localsindex=[];var ix,jx;var locallen=0;for(ix=0;ix<this.localsformat.length;ix++){var form=this.localsformat[ix];if(form.size==4){while(locallen&3)
locallen++;}
else if(form.size==2){while(locallen&1)
locallen++;}
for(jx=0;jx<form.count;jx++){this.localsindex.push({size:form.size,pos:locallen});locallen+=form.size;}}
while(locallen&3)
locallen++;this.locallen=locallen;}
function StackFrame(vmfunc){var ix;this.vmfunc=vmfunc;this.depth=null;this.framestart=null;this.framelen=null;this.valstack=[];this.localspos=null;this.localsindex=vmfunc.localsindex;this.locals=[];for(ix=0;ix<this.localsindex.length;ix++){var form=this.localsindex[ix];this.locals[form.pos]=0;}
this.framelen=8+vmfunc.rawformat.length+vmfunc.locallen;}
function clone_stackframe(frame){var other=new StackFrame(frame.vmfunc);other.depth=frame.depth;other.framestart=frame.framestart;other.framelen=frame.framelen;other.valstack=frame.valstack.slice(0);other.localspos=frame.localspos;other.locals=frame.locals.slice(0);other.framelen=frame.framelen;return other;}
function push_serialized_stackframe(frame,arr){BytePush4(arr,frame.framelen);var rawformat=frame.vmfunc.rawformat;BytePush4(arr,8+rawformat.length);for(var i=0;i<rawformat.length;i++){arr.push(rawformat[i]);}
for(var i=0;i<frame.vmfunc.localsindex.length;i++){var form=frame.vmfunc.localsindex[i];if(form.size==4){while(arr.length&3)
arr.push(0);BytePush4(arr,frame.locals[form.pos]);}
else if(form.size==2){while(arr.length&1)
arr.push(0);BytePush2(arr,frame.locals[form.pos]);}
else{BytePush1(arr,frame.locals[form.pos]);}}
while(arr.length&3)
arr.push(0);for(var i=0;i<frame.valstack.length;i++){BytePush4(arr,frame.valstack[i]);}}
function pop_deserialized_stackframe(arr){var frameptr=ByteRead4(arr,arr.length-4);if(frameptr<0||frameptr>=arr.length){qlog("Bad frameptr in serialized stack frame");return undefined;}
arr=arr.splice(frameptr,arr.length);var framelen=ByteRead4(arr,0);var localspos=ByteRead4(arr,4);var rawformat=arr.slice(8,localspos);var localsformat=[];var addr=8;while(1){var loctype=ByteRead1(arr,addr);addr++;var locnum=ByteRead1(arr,addr);addr++;if(loctype==0){break;}
if(loctype!=1&&loctype!=2&&loctype!=4){fatal_error("Invalid local variable size in function header.",loctype);}
localsformat.push({size:loctype,count:locnum});}
var vmfunc=new VMFunc(null,null,localsformat,rawformat);var frame=new StackFrame(vmfunc);frame.framestart=frameptr;for(var i=0;i<frame.vmfunc.localsindex.length;i++){var form=frame.vmfunc.localsindex[i];if(form.size==4){frame.locals[form.pos]=ByteRead4(arr,4+localspos+form.pos);}
else if(form.size==2){frame.locals[form.pos]=ByteRead2(arr,4+localspos+form.pos);}
else{frame.locals[form.pos]=ByteRead1(arr,4+localspos+form.pos);}}
for(var pos=framelen;pos<arr.length;pos+=4){frame.valstack.push(ByteRead4(arr,pos));}
return frame;}
function VMTextEnv(addr,dectab){if(addr==0)
fatal_error("Tried to create a VMTextEnv for address zero.");this.addr=addr;this.cacheable=(dectab!==undefined);this.decoding_tree=dectab;this.vmstring_tables=[];if(this.cacheable){this.vmstring_tables[0]={};this.vmstring_tables[1]={};this.vmstring_tables[2]={};}}
var operandlist_table=null;function setup_operandlist_table(){function OperandList(formlist,argsize){this.argsize=(argsize?argsize:4);this.numops=formlist.length;var ls=[];for(var ix=0;ix<formlist.length;ix++)
ls.push(formlist.charAt(ix));this.formlist=ls;}
var list_none=new OperandList("");var list_L=new OperandList("L");var list_LL=new OperandList("LL");var list_LLL=new OperandList("LLL");var list_LLLL=new OperandList("LLLL");var list_LS=new OperandList("LS");var list_LLS=new OperandList("LLS");var list_LLLLLLS=new OperandList("LLLLLLS");var list_LLLLLLLS=new OperandList("LLLLLLLS");var list_LLSS=new OperandList("LLSS");var list_LC=new OperandList("LC");var list_LLC=new OperandList("LLC");var list_LLLC=new OperandList("LLLC");var list_LLLLC=new OperandList("LLLLC");var list_ES=new OperandList("ES");var list_LES=new OperandList("LES");var list_EES=new OperandList("EES");var list_F=new OperandList("F");var list_LF=new OperandList("LF");var list_LLF=new OperandList("LLF");var list_EF=new OperandList("EF");var list_1EF=new OperandList("EF",1);var list_2EF=new OperandList("EF",2);var list_S=new OperandList("S");var list_SS=new OperandList("SS");var list_CL=new OperandList("CL");var list_C=new OperandList("C");operandlist_table={0x00:list_none,0x10:list_EES,0x11:list_LES,0x12:list_LLS,0x13:list_LLS,0x14:list_LLS,0x15:list_ES,0x18:list_EES,0x19:list_EES,0x1A:list_EES,0x1B:list_ES,0x1C:list_LLS,0x1D:list_LLS,0x1E:list_LLS,0x20:list_L,0x22:list_LL,0x23:list_LL,0x24:list_LLL,0x25:list_LLL,0x26:list_LLL,0x27:list_LLL,0x28:list_LLL,0x29:list_LLL,0x2A:list_LLL,0x2B:list_LLL,0x2C:list_LLL,0x2D:list_LLL,0x30:list_LLC,0x31:list_L,0x32:list_CL,0x33:list_LL,0x34:list_LL,0x40:list_EF,0x41:list_2EF,0x42:list_1EF,0x44:list_LS,0x45:list_LS,0x48:list_LLS,0x49:list_LLS,0x4A:list_LLS,0x4B:list_LLS,0x4C:list_LLL,0x4D:list_LLL,0x4E:list_LLL,0x4F:list_LLL,0x50:list_F,0x51:list_LF,0x52:list_none,0x53:list_LL,0x54:list_L,0x70:list_L,0x71:list_L,0x72:list_L,0x73:list_L,0x100:list_LLS,0x101:list_L,0x102:list_S,0x103:list_LS,0x104:list_L,0x110:list_LS,0x111:list_L,0x120:list_none,0x121:list_S,0x122:list_none,0x123:list_LC,0x124:list_LF,0x125:list_C,0x126:list_F,0x127:list_LL,0x130:list_LLF,0x140:list_S,0x141:list_L,0x148:list_SS,0x149:list_LL,0x150:list_LLLLLLLS,0x151:list_LLLLLLLS,0x152:list_LLLLLLS,0x160:list_LC,0x161:list_LLC,0x162:list_LLLC,0x163:list_LLLLC,0x170:list_LL,0x171:list_LLL,0x178:list_LS,0x179:list_L,0x180:list_LL,0x181:list_LL,0x190:list_LS,0x191:list_LS,0x192:list_LS,0x198:list_LS,0x199:list_LS,0x1A0:list_LLS,0x1A1:list_LLS,0x1A2:list_LLS,0x1A3:list_LLS,0x1A4:list_LLSS,0x1A8:list_LS,0x1A9:list_LS,0x1AA:list_LS,0x1AB:list_LLS,0x1B0:list_LS,0x1B1:list_LS,0x1B2:list_LS,0x1B3:list_LS,0x1B4:list_LS,0x1B5:list_LS,0x1B6:list_LLS,0x1C0:list_LLLL,0x1C1:list_LLLL,0x1C2:list_LLL,0x1C3:list_LLL,0x1C4:list_LLL,0x1C5:list_LLL,0x1C8:list_LL,0x1C9:list_LL}}
var funcop_cache={};function oputil_record_funcop(funcop){if(funcop.mode==0){return"null";}
var key="m"+funcop.mode;if(funcop.argsize!=null)
key=key+"s"+funcop.argsize;if(funcop.addr!=null)
key=key+"a"+funcop.addr;if(funcop_cache.key)
return"funcop_cache."+key;var obj={key:key,mode:funcop.mode,argsize:funcop.argsize,addr:funcop.addr};funcop_cache[key]=obj;return"funcop_cache."+key;}
function oputil_store(context,funcop,operand){switch(funcop.mode){case 8:if(funcop.argsize==4){var opchar=operand[0];if(opchar==="0"){context.offstack.push(operand);return;}
if(opchar==="_"){push_offstack_holdvar(context,operand);return;}}
holdvar=alloc_holdvar(context,true);context.offstack.push(holdvar);if(funcop.argsize==4){context.code.push(holdvar+"=("+operand+");");}
else if(funcop.argsize==2){context.code.push(holdvar+"=0xffff&("+operand+");");}
else{context.code.push(holdvar+"=0xff&("+operand+");");}
return;case 0:context.code.push("("+operand+");");return;case 11:if(funcop.argsize==4){var opchar=operand[0];if(opchar==="0"){store_offloc_value(context,funcop.addr,operand,false);return;}
if(opchar==="_"){store_offloc_value(context,funcop.addr,operand,true);return;}}
store_offloc_value(context,funcop.addr,undefined);if(funcop.argsize==4){context.code.push("frame.locals["+funcop.addr+"]=("+operand+");");}
else if(funcop.argsize==2){context.code.push("frame.locals["+funcop.addr+"]=(0xffff &"+operand+");");}
else{context.code.push("frame.locals["+funcop.addr+"]=(0xff &"+operand+");");}
return;case 15:if(funcop.argsize==4){context.code.push("MemW4("+funcop.addr+","+operand+");");}
else if(funcop.argsize==2){context.code.push("MemW2("+funcop.addr+","+operand+");");}
else{context.code.push("MemW1("+funcop.addr+","+operand+");");}
return;default:fatal_error("Unknown addressing mode in store func operand.");}}
function oputil_push_callstub(context,operand,addr){if(addr===undefined)
addr=context.cp;context.code.push("frame.valstack.push("+operand+","+addr+",frame.framestart);");}
function oputil_push_substring_callstub(context){context.code.push("if (!substring) { substring=true;");context.code.push("frame.valstack.push(0x11,0,nextcp,frame.framestart);");context.code.push("}");}
function oputil_unload_offstate(context,keepstack){var ix;if(context.offstack.length){context.code.push("frame.valstack.push("+context.offstack.join(",")+");");}
if(context.offloc.length){for(ix=0;ix<context.offloc.length;ix++){if(context.offloc[ix]!==undefined&&context.offlocdirty[ix]){context.code.push("frame.locals["+ix+"]="+context.offloc[ix]+";");}}}
if(!keepstack){var holdvar;for(ix=0;ix<context.offloc.length;ix++){holdvar=context.offloc[ix];if(holdvar!==undefined){if(context.holduse[holdvar]!==undefined)
context.holduse[holdvar]=false;}}
context.offloc.length=0;context.offlocdirty.length=0;while(context.offstack.length){holdvar=context.offstack.pop();if(context.holduse[holdvar]!==undefined)
context.holduse[holdvar]=false;}}}
function oputil_flush_string(context){if(context.buffer.length==0)
return;var str=context.buffer.join("");context.buffer.length=0;context.code.push("Glk.glk_put_jstring("+QuoteEscapeString(str)+");");}
function oputil_signify_operand(context,operand,hold){var val;if(quot_isconstant(operand)){val=Number(operand);if(val&0x80000000)
return""+(val-0x100000000);else
return operand;}
val="("+operand+"&0xffffffff)";if(hold){var holdvar=alloc_holdvar(context);context.code.push(holdvar+"="+val+";");return holdvar;}
else{return val;}}
function oputil_decode_float(context,operand,hold){var val;if(quot_isconstant(operand)){val=Number(operand);if(val==0x80000000)
return"-0";return""+decode_float(val);}
val="decode_float("+operand+")";if(hold){var holdvar=alloc_holdvar(context);context.code.push(holdvar+"="+val+";");return holdvar;}
else{return val;}}
function oputil_perform_jump(context,operand,unconditional){if(quot_isconstant(operand)){var val=Number(operand);if(val==0||val==1){if(unconditional){context.offstack.length=0;context.offloc.length=0;context.offlocdirty.length=0;}
else{}
context.code.push("leave_function();");context.code.push("pop_callstub("+val+");");}
else{oputil_unload_offstate(context,!unconditional);var newpc=(context.cp+val-2)>>>0;context.code.push("pc = "+newpc+";");context.vmfunc.pathaddrs[newpc]=true;}}
else{oputil_unload_offstate(context,!unconditional);context.code.push("if (("+operand+")==0 || ("+operand+")==1) {");context.code.push("leave_function();");context.code.push("pop_callstub("+operand+");");context.code.push("}");context.code.push("else {");context.code.push("pc = ("+context.cp+"+("+operand+")-2) >>>0;");context.code.push("}");}
context.code.push("return;");}
var opcode_table={0x0:function(context,operands){},0x10:function(context,operands){context.code.push(operands[2]+"(("+operands[0]+")+("+operands[1]+")) >>>0);");},0x11:function(context,operands){context.code.push(operands[2]+"(("+operands[0]+")-("+operands[1]+")) >>>0);");},0x12:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);context.code.push(operands[2]+"(("+sign0+")*("+sign1+")) >>>0);");},0x13:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);var holdvar=alloc_holdvar(context);context.code.push(holdvar+"=(("+sign0+")/("+sign1+"));");context.code.push("if (!isFinite("+holdvar+")) fatal_error('Division by zero.');");context.code.push(operands[2]+"("+holdvar+">=0)?Math.floor("+holdvar+"):(-Math.floor(-"+holdvar+") >>>0));");},0x14:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);var holdvar=alloc_holdvar(context);context.code.push(holdvar+"=(("+sign0+")%("+sign1+"));");context.code.push("if (!isFinite("+holdvar+")) fatal_error('Modulo division by zero.');");context.code.push(operands[2]+holdvar+" >>>0);");},0x15:function(context,operands){context.code.push(operands[1]+"(-("+operands[0]+")) >>>0);");},0x18:function(context,operands){context.code.push(operands[2]+"(("+operands[0]+")&("+operands[1]+")) >>>0);");},0x19:function(context,operands){context.code.push(operands[2]+"(("+operands[0]+")|("+operands[1]+")) >>>0);");},0x1a:function(context,operands){context.code.push(operands[2]+"(("+operands[0]+")^("+operands[1]+")) >>>0);");},0x1b:function(context,operands){context.code.push(operands[1]+"(~("+operands[0]+")) >>>0);");},0x1c:function(context,operands){if(quot_isconstant(operands[1])){var val=Number(operands[1]);if(val<32)
context.code.push(operands[2]+"(("+operands[0]+")<<"+val+") >>>0);");else
context.code.push(operands[2]+"0);");}
else{context.code.push(operands[2]+"("+operands[1]+"<32) ? (("+operands[0]+"<<"+operands[1]+") >>>0) : 0);");}},0x1d:function(context,operands){if(quot_isconstant(operands[1])){var val=Number(operands[1]);if(val<32)
context.code.push(operands[2]+"(("+operands[0]+")>>"+val+") >>>0);");else
context.code.push(operands[2]+"(("+operands[0]+")&0x80000000) ? 0xffffffff : 0);");}
else{context.code.push("if ("+operands[0]+" & 0x80000000) {");context.code.push(operands[2]+"("+operands[1]+"<32) ? (("+operands[0]+">>"+operands[1]+") >>>0) : 0xffffffff);");context.code.push("} else {");context.code.push(operands[2]+"("+operands[1]+"<32) ? (("+operands[0]+">>"+operands[1]+") >>>0) : 0);");context.code.push("}");}},0x1e:function(context,operands){if(quot_isconstant(operands[1])){var val=Number(operands[1]);if(val<32)
context.code.push(operands[2]+"("+operands[0]+")>>>"+val+");");else
context.code.push(operands[2]+"0);");}
else{context.code.push(operands[2]+"("+operands[1]+"<32) ? ("+operands[0]+">>>"+operands[1]+") : 0);");}},0x20:function(context,operands){oputil_perform_jump(context,operands[0],true);context.path_ends=true;},0x104:function(context,operands){if(quot_isconstant(operands[0])){var newpc=Number(operands[0]);context.code.push("pc = "+newpc+";");context.vmfunc.pathaddrs[newpc]=true;}
else{context.code.push("pc = "+operands[0]+";");}
oputil_unload_offstate(context);context.code.push("return;");context.path_ends=true;},0x22:function(context,operands){context.code.push("if (("+operands[0]+")==0) {");oputil_perform_jump(context,operands[1]);context.code.push("}");},0x23:function(context,operands){context.code.push("if (("+operands[0]+")!=0) {");oputil_perform_jump(context,operands[1]);context.code.push("}");},0x24:function(context,operands){context.code.push("if (("+operands[0]+")==("+operands[1]+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x25:function(context,operands){context.code.push("if (("+operands[0]+")!=("+operands[1]+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x26:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);context.code.push("if (("+sign0+")<("+sign1+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x27:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);context.code.push("if (("+sign0+")>=("+sign1+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x28:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);context.code.push("if (("+sign0+")>("+sign1+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x29:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);var sign1=oputil_signify_operand(context,operands[1]);context.code.push("if (("+sign0+")<=("+sign1+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x2a:function(context,operands){context.code.push("if (("+operands[0]+")<("+operands[1]+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x2b:function(context,operands){context.code.push("if (("+operands[0]+")>=("+operands[1]+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x2c:function(context,operands){context.code.push("if (("+operands[0]+")>("+operands[1]+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x2d:function(context,operands){context.code.push("if (("+operands[0]+")<=("+operands[1]+")) {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x30:function(context,operands){if(quot_isconstant(operands[1])){var ix;var argc=Number(operands[1]);for(ix=0;ix<argc;ix++){if(context.offstack.length){var holdvar=pop_offstack_holdvar(context);context.code.push("tempcallargs["+ix+"]="+holdvar+";");}
else{context.code.push("tempcallargs["+ix+"]=frame.valstack.pop();");}}
oputil_unload_offstate(context);}
else{context.varsused["ix"]=true;oputil_unload_offstate(context);context.code.push("for (ix=0; ix<"+operands[1]+"; ix++) { tempcallargs[ix]=frame.valstack.pop(); }");}
oputil_push_callstub(context,operands[2]);context.code.push("enter_function("+operands[0]+", "+operands[1]+");");context.code.push("return;");context.path_ends=true;},0x34:function(context,operands){if(quot_isconstant(operands[1])){var ix;var argc=Number(operands[1]);for(ix=0;ix<argc;ix++){if(context.offstack.length){var holdvar=pop_offstack_holdvar(context);context.code.push("tempcallargs["+ix+"]="+holdvar+";");}
else{context.code.push("tempcallargs["+ix+"]=frame.valstack.pop();");}}
oputil_unload_offstate(context);}
else{context.varsused["ix"]=true;oputil_unload_offstate(context);context.code.push("for (ix=0; ix<"+operands[1]+"; ix++) { tempcallargs[ix]=frame.valstack.pop(); }");}
context.code.push("leave_function();");context.code.push("enter_function("+operands[0]+", "+operands[1]+");");context.code.push("return;");context.path_ends=true;},0x160:function(context,operands){oputil_unload_offstate(context);oputil_push_callstub(context,operands[1]);context.code.push("enter_function("+operands[0]+", 0);");context.code.push("return;");context.path_ends=true;},0x161:function(context,operands){oputil_unload_offstate(context);context.code.push("tempcallargs[0]=("+operands[1]+");");oputil_push_callstub(context,operands[2]);context.code.push("enter_function("+operands[0]+", 1);");context.code.push("return;");context.path_ends=true;},0x162:function(context,operands){oputil_unload_offstate(context);context.code.push("tempcallargs[0]=("+operands[1]+");");context.code.push("tempcallargs[1]=("+operands[2]+");");oputil_push_callstub(context,operands[3]);context.code.push("enter_function("+operands[0]+", 2);");context.code.push("return;");context.path_ends=true;},0x163:function(context,operands){oputil_unload_offstate(context);context.code.push("tempcallargs[0]=("+operands[1]+");");context.code.push("tempcallargs[1]=("+operands[2]+");");context.code.push("tempcallargs[2]=("+operands[3]+");");oputil_push_callstub(context,operands[4]);context.code.push("enter_function("+operands[0]+", 3);");context.code.push("return;");context.path_ends=true;},0x31:function(context,operands){context.offstack.length=0;context.offloc.length=0;context.offlocdirty.length=0;context.code.push("leave_function();");context.code.push("pop_callstub("+operands[0]+");");context.code.push("return;");context.path_ends=true;},0x32:function(context,operands){oputil_unload_offstate(context);oputil_push_callstub(context,operands[0]);context.code.push("store_operand("+operands[0]+",frame.framestart+frame.framelen+4*frame.valstack.length);");oputil_perform_jump(context,operands[1],true);context.path_ends=true;},0x33:function(context,operands){context.offstack.length=0;context.offloc.length=0;context.offlocdirty.length=0;context.code.push("pop_stack_to("+operands[1]+");");context.code.push("pop_callstub("+operands[0]+");");context.code.push("return;");context.path_ends=true;},0x40:function(context,operands){oputil_store(context,operands[1],operands[0]);},0x41:function(context,operands){oputil_store(context,operands[1],operands[0]);},0x42:function(context,operands){oputil_store(context,operands[1],operands[0]);},0x44:function(context,operands){var val;if(quot_isconstant(operands[0])){val=Number(operands[0]);val=(val&0x8000)?((val|0xffff0000)>>>0):(val&0xffff);context.code.push(operands[1]+val+");");}
else{context.code.push(operands[1]+"("+operands[0]+" & 0x8000) ? (("+operands[0]+" | 0xffff0000) >>> 0) : ("+operands[0]+" & 0xffff));");}},0x45:function(context,operands){var val;if(quot_isconstant(operands[0])){val=Number(operands[0]);val=(val&0x80)?((val|0xffffff00)>>>0):(val&0xff);context.code.push(operands[1]+val+");");}
else{context.code.push(operands[1]+"("+operands[0]+" & 0x80) ? (("+operands[0]+" | 0xffffff00) >>> 0) : ("+operands[0]+" & 0xff));");}},0x48:function(context,operands){var val,addr;if(quot_isconstant(operands[1])){if(quot_isconstant(operands[0])){addr=Number(operands[0])+Number(operands[1])*4;val="Mem4("+(addr>>>0)+")";}
else{var addr=Number(operands[1])*4;if(addr)
val="Mem4(("+operands[0]+"+"+addr+") >>>0)";else
val="Mem4("+operands[0]+")";}}
else{val="Mem4(("+operands[0]+"+4*"+operands[1]+") >>>0)";}
context.code.push(operands[2]+val+");");},0x49:function(context,operands){var val,addr;if(quot_isconstant(operands[1])){if(quot_isconstant(operands[0])){addr=Number(operands[0])+Number(operands[1])*2;val="Mem2("+(addr>>>0)+")";}
else{var addr=Number(operands[1])*2;if(addr)
val="Mem2(("+operands[0]+"+"+addr+") >>>0)";else
val="Mem2("+operands[0]+")";}}
else{val="Mem2(("+operands[0]+"+2*"+operands[1]+") >>>0)";}
context.code.push(operands[2]+val+");");},0x4a:function(context,operands){var val,addr;if(quot_isconstant(operands[1])){if(quot_isconstant(operands[0])){addr=Number(operands[0])+Number(operands[1]);val="Mem1("+(addr>>>0)+")";}
else{var addr=Number(operands[1]);if(addr)
val="Mem1(("+operands[0]+"+"+addr+") >>>0)";else
val="Mem1("+operands[0]+")";}}
else{val="Mem1(("+operands[0]+"+"+operands[1]+") >>>0)";}
context.code.push(operands[2]+val+");");},0x4c:function(context,operands){var val,addr;if(quot_isconstant(operands[1])){if(quot_isconstant(operands[0])){addr=Number(operands[0])+Number(operands[1])*4;val=(addr>>>0)+",";}
else{var addr=Number(operands[1])*4;if(addr)
val="("+operands[0]+"+"+addr+") >>>0"+",";else
val=operands[0]+",";}}
else{val="("+operands[0]+"+4*"+operands[1]+") >>>0"+",";}
context.code.push("MemW4("+val+operands[2]+")"+";");},0x4d:function(context,operands){var val,addr;if(quot_isconstant(operands[1])){if(quot_isconstant(operands[0])){addr=Number(operands[0])+Number(operands[1])*2;val=(addr>>>0)+",";}
else{var addr=Number(operands[1])*2;if(addr)
val="("+operands[0]+"+"+addr+") >>>0"+",";else
val=operands[0]+",";}}
else{val="("+operands[0]+"+2*"+operands[1]+") >>>0"+",";}
context.code.push("MemW2("+val+operands[2]+")"+";");},0x4e:function(context,operands){var val,addr;if(quot_isconstant(operands[1])){if(quot_isconstant(operands[0])){addr=Number(operands[0])+Number(operands[1]);val=(addr>>>0)+",";}
else{var addr=Number(operands[1]);if(addr)
val="("+operands[0]+"+"+addr+") >>>0"+",";else
val=operands[0]+",";}}
else{val="("+operands[0]+"+"+operands[1]+") >>>0"+",";}
context.code.push("MemW1("+val+operands[2]+")"+";");},0x4b:function(context,operands){if(quot_isconstant(operands[1])){var bitx,addrx,bitnum;bitnum=Number(operands[1])&0xffffffff;bitx=bitnum&7;if(quot_isconstant(operands[0])){addrx=Number(operands[0]);if(bitnum>=0)
addrx+=(bitnum>>3);else
addrx-=(1+((-1-bitnum)>>3));}
else{if(bitnum>=0){if(bitnum<=7)
addrx=operands[0];else
addrx=(operands[0]+"+"+(bitnum>>3));}
else{addrx=(operands[0]+"-"+(1+((-1-bitnum)>>3)));}}
context.code.push(operands[2]+"(Mem1("+addrx+") & "+(1<<bitx)+")?1:0);");}
else{context.varsused["bitx"]=true;context.varsused["addrx"]=true;var sign1=oputil_signify_operand(context,operands[1],true);context.code.push("bitx = "+sign1+"&7;");context.code.push("if ("+sign1+">=0) addrx = "+operands[0]+" + ("+sign1+">>3);");context.code.push("else addrx = "+operands[0]+" - (1+((-1-("+sign1+"))>>3));");context.code.push(operands[2]+"(Mem1(addrx) & (1<<bitx))?1:0);");}},0x4f:function(context,operands){var bitx,addrx,mask,bitnum;if(quot_isconstant(operands[1])){bitnum=Number(operands[1])&0xffffffff;bitx=bitnum&7;if(quot_isconstant(operands[0])){addrx=Number(operands[0]);if(bitnum>=0)
addrx+=(bitnum>>3);else
addrx-=(1+((-1-bitnum)>>3));}
else{if(bitnum>=0){if(bitnum<=7)
addrx=operands[0];else
addrx=(operands[0]+"+"+(bitnum>>3));}
else{addrx=(operands[0]+"-"+(1+((-1-bitnum)>>3)));}}
mask=(1<<bitx);}
else{context.varsused["bitx"]=true;context.varsused["addrx"]=true;var sign1=oputil_signify_operand(context,operands[1],true);context.code.push("bitx = "+sign1+"&7;");context.code.push("if ("+sign1+">=0) addrx = "+operands[0]+" + ("+sign1+">>3);");context.code.push("else addrx = "+operands[0]+" - (1+((-1-("+sign1+"))>>3));");addrx="addrx";mask="(1<<bitx)";}
if(quot_isconstant(operands[2])){if(Number(operands[2]))
context.code.push("MemW1("+addrx+", Mem1("+addrx+") | "+mask+");");else
context.code.push("MemW1("+addrx+", Mem1("+addrx+") & ~("+mask+"));");}
else{context.code.push("if ("+operands[2]+") MemW1("+addrx+", Mem1("+addrx+") | "+mask+");");context.code.push("else MemW1("+addrx+", Mem1("+addrx+") & ~("+mask+"));");}},0x50:function(context,operands){var val;var count=context.offstack.length;if(count)
val="frame.valstack.length+"+count;else
val="frame.valstack.length";oputil_store(context,operands[0],val);},0x51:function(context,operands){var val;if(quot_isconstant(operands[0])){var pos=Number(operands[0]);if(pos<context.offstack.length){val=context.offstack[context.offstack.length-(pos+1)];}
else{val="frame.valstack[frame.valstack.length-"+((pos+1)-context.offstack.length)+"]";}}
else{oputil_unload_offstate(context);val="frame.valstack[frame.valstack.length-("+operands[0]+"+1)]";}
oputil_store(context,operands[1],val);},0x52:function(context,operands){var temp,len;if(context.offstack.length<2){transfer_to_offstack(context,2);}
len=context.offstack.length;temp=context.offstack[len-1];context.offstack[len-1]=context.offstack[len-2];context.offstack[len-2]=temp;},0x53:function(context,operands){oputil_unload_offstate(context);context.varsused["ix"]=true;context.varsused["pos"]=true;context.varsused["roll"]=true;context.varsused["vals1"]=true;var sign0=oputil_signify_operand(context,operands[0],true);var sign1=oputil_signify_operand(context,operands[1],true);context.code.push("if ("+sign0+" > 0) {");context.code.push("if ("+sign1+" > 0) {");context.code.push("vals1 = "+sign1+" % "+sign0+";");context.code.push("} else {");context.code.push("vals1 = "+sign0+" - (-("+sign1+")) % "+sign0+";");context.code.push("}");context.code.push("if (vals1) {");context.code.push("pos = frame.valstack.length - "+sign0+";");context.code.push("roll = frame.valstack.slice(frame.valstack.length-vals1, frame.valstack.length).concat(frame.valstack.slice(pos, frame.valstack.length-vals1));");context.code.push("for (ix=0; ix<"+sign0+"; ix++) { frame.valstack[pos+ix] = roll[ix]; }");context.code.push("roll = undefined;");context.code.push("}");context.code.push("}");},0x54:function(context,operands){oputil_unload_offstate(context);if(quot_isconstant(operands[0])){var ix,holdvar;var pos=Number(operands[0]);for(ix=0;ix<pos;ix++){holdvar=alloc_holdvar(context,true);context.offstack.push(holdvar);context.code.push(holdvar+"=frame.valstack[frame.valstack.length-"+(pos-ix)+"];");}}
else{context.varsused["ix"]=true;context.varsused["jx"]=true;context.code.push("jx = frame.valstack.length-("+operands[0]+");");context.code.push("for (ix=0; ix<"+operands[0]+"; ix++) { frame.valstack.push(frame.valstack[jx+ix]); }");}},0x100:function(context,operands){var expr="do_gestalt(("+operands[0]+"),("+operands[1]+"))";context.code.push(operands[2]+expr+");");},0x101:function(context,operands){context.code.push("fatal_error('User debugtrap encountered.', "+operands[0]+");");},0x102:function(context,operands){context.code.push(operands[0]+"endmem);");},0x103:function(context,operands){context.code.push("change_memsize("+operands[0]+",false);");context.code.push(operands[1]+"0);");},0x110:function(context,operands){var expr;if(quot_isconstant(operands[0])){var val=Number(operands[0])&0xffffffff;if(val==0)
expr="(Math.floor(random_func() * 0x10000) | (Math.floor(random_func() * 0x10000) << 16)) >>>0";else if(val>0)
expr="Math.floor(random_func() * "+val+")";else
expr="-Math.floor(random_func() * "+(-val)+")";}
else{var sign0=oputil_signify_operand(context,operands[0],true);var holdvar=alloc_holdvar(context);expr=holdvar;context.code.push("if ("+sign0+" > 0)");context.code.push(holdvar+" = Math.floor(random_func() * "+sign0+");");context.code.push("else if ("+sign0+" < 0)");context.code.push(holdvar+" = -Math.floor(random_func() * -"+sign0+");");context.code.push("else");context.code.push(holdvar+" = (Math.floor(random_func() * 0x10000) | (Math.floor(random_func() * 0x10000) << 16)) >>>0;");}
context.code.push(operands[1]+expr+");");},0x111:function(context,operands){context.code.push("set_random("+operands[0]+");");},0x120:function(context,operands){context.offstack.length=0;context.offloc.length=0;context.offlocdirty.length=0;context.code.push("done_executing = true; vm_stopped = true;");context.code.push("return;");context.path_ends=true;},0x121:function(context,operands){context.code.push(operands[0]+"perform_verify());");},0x122:function(context,operands){context.offstack.length=0;context.offloc.length=0;context.offlocdirty.length=0;context.code.push("vm_restart();");context.code.push("return;");context.path_ends=true;},0x123:function(context,operands){oputil_unload_offstate(context);context.varsused["ix"]=true;oputil_push_callstub(context,operands[1]);context.code.push("ix = vm_save("+operands[0]+");");context.code.push("pop_callstub(ix ? 0 : 1);");context.code.push("return;");context.path_ends=true;},0x124:function(context,operands){oputil_unload_offstate(context);context.code.push("if (vm_restore("+operands[0]+")) {");context.code.push("pop_callstub((-1)>>>0);");context.code.push("} else {");oputil_store(context,operands[1],"1");oputil_unload_offstate(context);context.code.push("pc = "+context.cp+";");context.code.push("}");context.code.push("return;");context.path_ends=true;},0x125:function(context,operands){oputil_unload_offstate(context);oputil_push_callstub(context,operands[0]);context.code.push("vm_saveundo();");context.code.push("pop_callstub(0);");context.code.push("return;");context.path_ends=true;},0x126:function(context,operands){oputil_unload_offstate(context);context.code.push("if (vm_restoreundo()) {");context.code.push("pop_callstub((-1)>>>0);");context.code.push("} else {");oputil_store(context,operands[0],"1");oputil_unload_offstate(context);context.code.push("pc = "+context.cp+";");context.code.push("}");context.code.push("return;");context.path_ends=true;},0x127:function(context,operands){context.code.push("protectstart="+operands[0]+";");context.code.push("protectend=protectstart+("+operands[1]+");");context.code.push("if (protectstart==protectend) {")
context.code.push("  protectstart=0; protectend=0;");context.code.push("}");},0x170:function(context,operands){context.varsused["maddr"]=true;context.varsused["mlen"]=true;context.varsused["ix"]=true;context.code.push("mlen="+operands[0]+";");context.code.push("maddr="+operands[1]+";");context.code.push("for (ix=0; ix<mlen; ix++, maddr++) MemW1(maddr, 0);");},0x171:function(context,operands){context.varsused["msrc"]=true;context.varsused["mdest"]=true;context.varsused["mlen"]=true;context.varsused["ix"]=true;context.code.push("mlen="+operands[0]+";");context.code.push("msrc="+operands[1]+";");context.code.push("mdest="+operands[2]+";");context.code.push("if (mdest < msrc) {");context.code.push("for (ix=0; ix<mlen; ix++, msrc++, mdest++) MemW1(mdest, Mem1(msrc));");context.code.push("} else {");context.code.push("msrc += (mlen-1); mdest += (mlen-1);");context.code.push("for (ix=0; ix<mlen; ix++, msrc--, mdest--) MemW1(mdest, Mem1(msrc));");context.code.push("}");},0x178:function(context,operands){var expr="heap_malloc("+operands[0]+")";context.code.push(operands[1]+expr+");");},0x179:function(context,operands){context.code.push("heap_free("+operands[0]+");");},0x180:function(context,operands){context.code.push("accel_address_map["+operands[1]+"] = accel_func_map["+operands[0]+"];");},0x181:function(context,operands){context.code.push("if ("+operands[0]+" < 9) {");context.code.push("  accel_params["+operands[0]+"] = "+operands[1]+";");context.code.push("}");},0x150:function(context,operands){var expr="linear_search(("+operands[0]+"),("+operands[1]+"),("+operands[2]+"),("+operands[3]+"),("+operands[4]+"),("+operands[5]+"),("+operands[6]+"))";context.code.push(operands[7]+expr+");");},0x151:function(context,operands){var expr="binary_search(("+operands[0]+"),("+operands[1]+"),("+operands[2]+"),("+operands[3]+"),("+operands[4]+"),("+operands[5]+"),("+operands[6]+"))";context.code.push(operands[7]+expr+");");},0x152:function(context,operands){var expr="linked_search(("+operands[0]+"),("+operands[1]+"),("+operands[2]+"),("+operands[3]+"),("+operands[4]+"),("+operands[5]+"))";context.code.push(operands[6]+expr+");");},0x70:function(context,operands){switch(context.curiosys){case 2:if(quot_isconstant(operands[0])){var val=Number(operands[0])&0xff;context.code.push("Glk.glk_put_char("+val+");");}
else{context.code.push("Glk.glk_put_char(("+operands[0]+")&0xff);");}
break;case 1:oputil_unload_offstate(context);context.code.push("tempcallargs[0]=(("+operands[0]+")&0xff);");oputil_push_callstub(context,"0,0");context.code.push("enter_function(iosysrock, 1);");context.code.push("return;");context.path_ends=true;break;case 0:break;}},0x71:function(context,operands){switch(context.curiosys){case 2:var sign0=oputil_signify_operand(context,operands[0]);if(quot_isconstant(operands[0])){var val=Number(sign0).toString(10);context.code.push("Glk.glk_put_jstring("+QuoteEscapeString(val)+", true);");}
else{context.code.push("Glk.glk_put_jstring(("+sign0+").toString(10), true);");}
break;case 1:oputil_unload_offstate(context);context.code.push("stream_num("+context.cp+","+operands[0]+", false, 0);");context.code.push("return;");context.path_ends=true;break;case 0:break;}},0x72:function(context,operands){oputil_unload_offstate(context);context.code.push("if (stream_string("+context.cp+","+operands[0]+", 0, 0)) return;");},0x73:function(context,operands){switch(context.curiosys){case 2:if(quot_isconstant(operands[0])){var val=Number(operands[0]);context.code.push("Glk.glk_put_char_uni("+val+");");}
else{context.code.push("Glk.glk_put_char_uni("+operands[0]+");");}
break;case 1:oputil_unload_offstate(context);context.code.push("tempcallargs[0]=("+operands[0]+");");oputil_push_callstub(context,"0,0");context.code.push("enter_function(iosysrock, 1);");context.code.push("return;");context.path_ends=true;break;case 0:break;}},0x140:function(context,operands){context.code.push(operands[0]+"stringtable)");},0x141:function(context,operands){context.code.push("set_string_table("+operands[0]+");");},0x148:function(context,operands){context.code.push(operands[0]+"iosysmode)");context.code.push(operands[1]+"iosysrock)");},0x149:function(context,operands){context.code.push("set_iosys("+operands[0]+","+operands[1]+");");if(quot_isconstant(operands[0])){var val=Number(operands[0]);context.curiosys=val;}
else{oputil_unload_offstate(context);context.code.push("pc = "+context.cp+";");context.code.push("return;");context.path_ends=true;}},0x190:function(context,operands){var sign0=oputil_signify_operand(context,operands[0]);if(quot_isconstant(operands[0])){var val=Number(sign0);context.code.push(operands[1]+encode_float(val)+");");}
else{context.code.push(operands[1]+"encode_float("+sign0+"));");}},0x191:function(context,operands){context.varsused["valf"]=true;context.varsused["res"]=true;context.code.push("valf = "+oputil_decode_float(context,operands[0])+";");context.code.push("if (!("+operands[0]+" & 0x80000000)) {");context.code.push("  if (isNaN(valf) || !isFinite(valf) || (valf > 0x7fffffff))");context.code.push("    res = 0x7fffffff;");context.code.push("  else");context.code.push("    res = Math.floor(valf);");context.code.push("} else {");context.code.push("  if (isNaN(valf) || !isFinite(valf) || (valf < -0x80000000))");context.code.push("    res = -0x80000000;");context.code.push("  else");context.code.push("    res = Math.ceil(valf);");context.code.push("}");context.code.push(operands[1]+"res>>>0);");},0x192:function(context,operands){context.varsused["valf"]=true;context.varsused["res"]=true;context.code.push("valf = "+oputil_decode_float(context,operands[0])+";");context.code.push("if (!("+operands[0]+" & 0x80000000)) {");context.code.push("  if (isNaN(valf) || !isFinite(valf))");context.code.push("    res = 0x7fffffff;");context.code.push("  else");context.code.push("    res = Math.round(valf);");context.code.push("  if (res > 0x7fffffff) res = 0x7fffffff;");context.code.push("} else {");context.code.push("  if (isNaN(valf) || !isFinite(valf))");context.code.push("    res = -0x80000000;");context.code.push("  else");context.code.push("    res = Math.round(valf);");context.code.push("  if (res < -0x80000000) res = -0x80000000;");context.code.push("}");context.code.push(operands[1]+"res>>>0);");},0x198:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.ceil("+valf+")));");},0x199:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.floor("+valf+")));");},0x1A0:function(context,operands){var valf0=oputil_decode_float(context,operands[0]);var valf1=oputil_decode_float(context,operands[1]);context.code.push(operands[2]+"encode_float("+valf0+" + "+valf1+"));");},0x1A1:function(context,operands){var valf0=oputil_decode_float(context,operands[0]);var valf1=oputil_decode_float(context,operands[1]);context.code.push(operands[2]+"encode_float("+valf0+" - "+valf1+"));");},0x1A2:function(context,operands){var valf0=oputil_decode_float(context,operands[0]);var valf1=oputil_decode_float(context,operands[1]);context.code.push(operands[2]+"encode_float("+valf0+" * "+valf1+"));");},0x1A3:function(context,operands){var valf0=oputil_decode_float(context,operands[0]);var valf1=oputil_decode_float(context,operands[1]);context.code.push(operands[2]+"encode_float("+valf0+" / "+valf1+"));");},0x1A4:function(context,operands){var valf0=oputil_decode_float(context,operands[0],true);var valf1=oputil_decode_float(context,operands[1],true);context.varsused["modv"]=true;context.varsused["quov"]=true;context.code.push("modv=("+valf0+" % "+valf1+");");context.code.push("quov=encode_float(("+valf0+" - modv) / "+valf1+");");context.code.push("if (quov == 0x0 || quov == 0x80000000) {");context.code.push("  quov = (("+operands[0]+" ^ "+operands[1]+") & 0x80000000) >>>0;");context.code.push("}");context.code.push(operands[2]+"encode_float(modv));");context.code.push(operands[3]+"quov);");},0x1A8:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.sqrt("+valf+")));");},0x1A9:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.exp("+valf+")));");},0x1AA:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.log("+valf+")));");},0x1AB:function(context,operands){context.varsused["valf"]=true;var valf0=oputil_decode_float(context,operands[0],true);var valf1=oputil_decode_float(context,operands[1],true);context.code.push("if ("+operands[0]+" == 0x3f800000) {");context.code.push("  valf = 0x3f800000;");context.code.push("} else if ("+operands[0]+" == 0xbf800000 && ("+operands[1]+" == 0xff800000 || "+operands[1]+" == 0x7f800000)) {");context.code.push("  valf = 0x3f800000;");context.code.push("} else {");context.code.push("  valf=encode_float(Math.pow("+valf0+", "+valf1+"));");context.code.push("}");context.code.push(operands[2]+"valf);");},0x1B0:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.sin("+valf+")));");},0x1B1:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.cos("+valf+")));");},0x1B2:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.tan("+valf+")));");},0x1B3:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.asin("+valf+")));");},0x1B4:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.acos("+valf+")));");},0x1B5:function(context,operands){var valf=oputil_decode_float(context,operands[0]);context.code.push(operands[1]+"encode_float(Math.atan("+valf+")));");},0x1B6:function(context,operands){var valf0=oputil_decode_float(context,operands[0]);var valf1=oputil_decode_float(context,operands[1]);context.code.push(operands[2]+"encode_float(Math.atan2("+valf0+", "+valf1+")));");},0x1C0:function(context,operands){var val,valf0,valf1,valf2;context.varsused["fequal"]=true;context.varsused["fdiff"]=true;context.code.push("if (("+operands[2]+" & 0x7f800000) == 0x7f800000 && ("+operands[2]+" & 0x007fffff) != 0) {");context.code.push("  fequal = 0;");context.code.push("} else if (("+operands[0]+" == 0xff800000 || "+operands[0]+" == 0x7f800000) && ("+operands[1]+" == 0xff800000 || "+operands[1]+" == 0x7f800000)) {");context.code.push("  fequal = ("+operands[0]+" == "+operands[1]+");");context.code.push("} else {");if(quot_isconstant(operands[2])){val=Number(operands[2]);valf2=""+decode_float(val&0x7fffffff);}
else{val="decode_float(("+operands[2]+") & 0x7fffffff)";valf2=alloc_holdvar(context);context.code.push(valf2+"="+val+";");}
valf0=oputil_decode_float(context,operands[0]);valf1=oputil_decode_float(context,operands[1]);context.code.push("  fdiff = "+valf1+" - "+valf0+";");context.code.push("  fequal = (fdiff <= "+valf2+" && fdiff >= -("+valf2+"));");context.code.push("}");context.code.push("if (fequal) {");oputil_perform_jump(context,operands[3]);context.code.push("}");},0x1C1:function(context,operands){var val,valf0,valf1,valf2;context.varsused["fequal"]=true;context.varsused["fdiff"]=true;context.code.push("if (("+operands[2]+" & 0x7f800000) == 0x7f800000 && ("+operands[2]+" & 0x007fffff) != 0) {");context.code.push("  fequal = 0;");context.code.push("} else if (("+operands[0]+" == 0xff800000 || "+operands[0]+" == 0x7f800000) && ("+operands[1]+" == 0xff800000 || "+operands[1]+" == 0x7f800000)) {");context.code.push("  fequal = ("+operands[0]+" == "+operands[1]+");");context.code.push("} else {");if(quot_isconstant(operands[2])){val=Number(operands[2]);valf2=""+decode_float(val&0x7fffffff);}
else{val="decode_float(("+operands[2]+") & 0x7fffffff)";valf2=alloc_holdvar(context);context.code.push(valf2+"="+val+";");}
valf0=oputil_decode_float(context,operands[0]);valf1=oputil_decode_float(context,operands[1]);context.code.push("  fdiff = "+valf1+" - "+valf0+";");context.code.push("  fequal = (fdiff <= "+valf2+" && fdiff >= -("+valf2+"));");context.code.push("}");context.code.push("if (!fequal) {");oputil_perform_jump(context,operands[3]);context.code.push("}");},0x1C2:function(context,operands){valf0=oputil_decode_float(context,operands[0]);valf1=oputil_decode_float(context,operands[1]);context.code.push("if ("+valf0+" < "+valf1+") {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x1C3:function(context,operands){valf0=oputil_decode_float(context,operands[0]);valf1=oputil_decode_float(context,operands[1]);context.code.push("if ("+valf0+" <= "+valf1+") {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x1C4:function(context,operands){valf0=oputil_decode_float(context,operands[0]);valf1=oputil_decode_float(context,operands[1]);context.code.push("if ("+valf0+" > "+valf1+") {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x1C5:function(context,operands){valf0=oputil_decode_float(context,operands[0]);valf1=oputil_decode_float(context,operands[1]);context.code.push("if ("+valf0+" >= "+valf1+") {");oputil_perform_jump(context,operands[2]);context.code.push("}");},0x1C8:function(context,operands){context.code.push("if (("+operands[0]+" & 0x7f800000) == 0x7f800000 && ("+operands[0]+" & 0x007fffff) != 0) {");oputil_perform_jump(context,operands[1]);context.code.push("}");},0x1C9:function(context,operands){context.code.push("if ("+operands[0]+" == 0xff800000 || "+operands[0]+" == 0x7f800000) {");oputil_perform_jump(context,operands[1]);context.code.push("}");},0x130:function(context,operands){var mayblock;if(quot_isconstant(operands[0]))
mayblock=Glk.call_may_not_return(Number(operands[0]));else
mayblock=true;context.code.push("tempglkargs.length = "+operands[1]+";");if(quot_isconstant(operands[1])){var ix;var argc=Number(operands[1]);for(ix=0;ix<argc;ix++){if(context.offstack.length){var holdvar=pop_offstack_holdvar(context);context.code.push("tempglkargs["+ix+"]="+holdvar+";");}
else{context.code.push("tempglkargs["+ix+"]=frame.valstack.pop();");}}
oputil_unload_offstate(context);}
else{context.varsused["ix"]=true;oputil_unload_offstate(context);context.code.push("for (ix=0; ix<"+operands[1]+"; ix++) { tempglkargs[ix]=frame.valstack.pop(); }");}
context.varsused["glkret"]=true;context.code.push("glkret = GiDispa.get_function("+operands[0]+")(tempglkargs);");if(mayblock){context.code.push("if (glkret === Glk.DidNotReturn) {");context.code.push("  resumefuncop = "+oputil_record_funcop(operands[2])+";");context.code.push("  resumevalue = 0;");context.code.push("  pc = "+context.cp+";");context.code.push("  done_executing = true;");context.code.push("  return;");context.code.push("}");}
oputil_store(context,operands[2],"glkret");}}
function alloc_holdvar(context,use){var ix=0;var key;while(true){key="_hold"+ix;if(!context.holduse[key]){context.holduse[key]=(use?1:true);return key;}
ix++;}}
function pop_offstack_holdvar(context){var holdvar=context.offstack.pop();if(quot_isconstant(holdvar)){return holdvar;}
var use=context.holduse[holdvar];use--;if(use==0)
use=true;context.holduse[holdvar]=use;return holdvar;}
function push_offstack_holdvar(context,holdvar){context.offstack.push(holdvar);var use=context.holduse[holdvar];if(!use||use===true)
use=1;else
use++;context.holduse[holdvar]=use;}
function store_offloc_value(context,addr,value,inchold){var oldvar=context.offloc[addr];if(oldvar&&quot_isholdvar(oldvar)){var use=context.holduse[oldvar];use--;if(use==0)
use=true;context.holduse[oldvar]=use;}
if(value===undefined){context.offloc[addr]=undefined;context.offlocdirty[addr]=false;return;}
context.offloc[addr]=value;context.offlocdirty[addr]=true;if(inchold){var holdvar=value;var use=context.holduse[holdvar];if(!use||use===true)
use=1;else
use++;context.holduse[holdvar]=use;}}
function transfer_to_offstack(context,count){var holdvar;while(context.offstack.length<count){holdvar=alloc_holdvar(context,true);context.offstack.unshift(holdvar);context.code.push(holdvar+"=frame.valstack.pop();");}}
function quot_isconstant(val){return(val[0]==="0");}
function quot_isholdvar(val){return(val[0]==="_");}
function parse_operands(context,cp,oplist,operands){var modeaddr;var ix,modeval,mode;var value,addr;var holdvar;operands.desttype=0;operands.numops=oplist.numops;modeaddr=cp;cp+=((oplist.numops+1)>>1);for(ix=0;ix<oplist.numops;ix++){if((ix&1)==0){modeval=Mem1(modeaddr);mode=(modeval&0x0F);}
else{mode=((modeval>>4)&0x0F);modeaddr++;}
var optype=oplist.formlist[ix];if(optype=="L"){switch(mode){case 8:if(context.offstack.length){operands[ix]=pop_offstack_holdvar(context);}
else{holdvar=alloc_holdvar(context);context.code.push(holdvar+"=frame.valstack.pop();");operands[ix]=holdvar;}
continue;case 0:operands[ix]="0";continue;case 1:value=QuoteMem1(cp);cp++;operands[ix]=value;continue;case 2:value=QuoteMem2(cp);cp+=2;operands[ix]=value;continue;case 3:value=QuoteMem4(cp);cp+=4;operands[ix]=value;continue;}
if(mode>=9&&mode<=11){if(mode==9){addr=Mem1(cp);cp++;}
else if(mode==10){addr=Mem2(cp);cp+=2;}
else if(mode==11){addr=Mem4(cp);cp+=4;}
if(context.offloc[addr]!==undefined){operands[ix]=context.offloc[addr];continue;}
if(oplist.argsize==4){value="frame.locals["+addr+"]";}
else if(oplist.argsize==2){value="frame.locals["+addr+"] & 0xffff";}
else{value="frame.locals["+addr+"] & 0xff";}
holdvar=alloc_holdvar(context,true);context.code.push(holdvar+"=("+value+");");context.offloc[addr]=holdvar;context.offlocdirty[addr]=false;operands[ix]=holdvar;continue;}
switch(mode){case 15:addr=Mem4(cp)+ramstart;cp+=4;break;case 14:addr=Mem2(cp)+ramstart;cp+=2;break;case 13:addr=Mem1(cp)+ramstart;cp++;break;case 7:addr=Mem4(cp);cp+=4;break;case 6:addr=Mem2(cp);cp+=2;break;case 5:addr=Mem1(cp);cp++;break;default:fatal_error("Unknown addressing mode in load operand.");}
if(oplist.argsize==4){value="Mem4("+addr+")";}
else if(oplist.argsize==2){value="Mem2("+addr+")";}
else{value="Mem1("+addr+")";}
holdvar=alloc_holdvar(context);context.code.push(holdvar+"=("+value+");");operands[ix]=holdvar;continue;}
else if(optype=="E"){switch(mode){case 8:if(context.offstack.length){operands[ix]=pop_offstack_holdvar(context);}
else{operands[ix]="frame.valstack.pop()";}
continue;case 0:operands[ix]="0";continue;case 1:value=QuoteMem1(cp);cp++;operands[ix]=value;continue;case 2:value=QuoteMem2(cp);cp+=2;operands[ix]=value;continue;case 3:value=QuoteMem4(cp);cp+=4;operands[ix]=value;continue;}
if(mode>=9&&mode<=11){if(mode==9){addr=Mem1(cp);cp++;}
else if(mode==10){addr=Mem2(cp);cp+=2;}
else if(mode==11){addr=Mem4(cp);cp+=4;}
if(context.offloc[addr]!==undefined){operands[ix]=context.offloc[addr];continue;}
if(oplist.argsize==4){value="frame.locals["+addr+"]";}
else if(oplist.argsize==2){value="frame.locals["+addr+"] & 0xffff";}
else{value="frame.locals["+addr+"] & 0xff";}
holdvar=alloc_holdvar(context,true);context.code.push(holdvar+"=("+value+");");context.offloc[addr]=holdvar;context.offlocdirty[addr]=false;operands[ix]=holdvar;continue;}
switch(mode){case 15:addr=Mem4(cp)+ramstart;cp+=4;break;case 14:addr=Mem2(cp)+ramstart;cp+=2;break;case 13:addr=Mem1(cp)+ramstart;cp++;break;case 7:addr=Mem4(cp);cp+=4;break;case 6:addr=Mem2(cp);cp+=2;break;case 5:addr=Mem1(cp);cp++;break;default:fatal_error("Unknown addressing mode in load operand.");}
if(oplist.argsize==4){value="Mem4("+addr+")";}
else if(oplist.argsize==2){value="Mem2("+addr+")";}
else{value="Mem1("+addr+")";}
operands[ix]=value;continue;}
else if(optype=="S"){switch(mode){case 8:holdvar=alloc_holdvar(context,true);context.offstack.push(holdvar);operands[ix]=holdvar+"=(";continue;case 0:operands[ix]="(";continue;}
if(mode>=9&&mode<=11){if(mode==9){addr=Mem1(cp);cp++;}
else if(mode==10){addr=Mem2(cp);cp+=2;}
else if(mode==11){addr=Mem4(cp);cp+=4;}
if(oplist.argsize==4){holdvar=alloc_holdvar(context,true);store_offloc_value(context,addr,holdvar,false);operands[ix]=holdvar+"=(";}
else if(oplist.argsize==2){store_offloc_value(context,addr,undefined);operands[ix]="frame.locals["+addr+"]=(0xffff &";}
else{store_offloc_value(context,addr,undefined);operands[ix]="frame.locals["+addr+"]=(0xff &";}
continue;}
switch(mode){case 15:addr=Mem4(cp)+ramstart;cp+=4;break;case 14:addr=Mem2(cp)+ramstart;cp+=2;break;case 13:addr=Mem1(cp)+ramstart;cp++;break;case 7:addr=Mem4(cp);cp+=4;break;case 6:addr=Mem2(cp);cp+=2;break;case 5:addr=Mem1(cp);cp++;break;default:fatal_error("Unknown addressing mode in store operand.");}
if(oplist.argsize==4){value="MemW4("+addr+",";}
else if(oplist.argsize==2){value="MemW2("+addr+",";}
else{value="MemW1("+addr+",";}
operands[ix]=value;continue;}
else if(optype=="F"){var funcop=operands.func_store;switch(mode){case 8:funcop.mode=8;funcop.argsize=oplist.argsize;operands[ix]=funcop;continue;case 0:funcop.mode=0;funcop.argsize=oplist.argsize;operands[ix]=funcop;continue;}
if(mode>=9&&mode<=11){if(mode==9){addr=Mem1(cp);cp++;}
else if(mode==10){addr=Mem2(cp);cp+=2;}
else if(mode==11){addr=Mem4(cp);cp+=4;}
funcop.mode=11;funcop.addr=addr;funcop.argsize=oplist.argsize;operands[ix]=funcop;continue;}
switch(mode){case 15:addr=Mem4(cp)+ramstart;cp+=4;break;case 14:addr=Mem2(cp)+ramstart;cp+=2;break;case 13:addr=Mem1(cp)+ramstart;cp++;break;case 7:addr=Mem4(cp);cp+=4;break;case 6:addr=Mem2(cp);cp+=2;break;case 5:addr=Mem1(cp);cp++;break;default:fatal_error("Unknown addressing mode in store operand.");}
funcop.mode=15;funcop.addr=addr;funcop.argsize=oplist.argsize;operands[ix]=funcop;continue;}
else if(optype=="C"){switch(mode){case 8:operands[ix]="3,0";continue;case 0:operands[ix]="0,0";continue;}
if(mode>=9&&mode<=11){if(mode==9){addr=Mem1(cp);cp++;}
else if(mode==10){addr=Mem2(cp);cp+=2;}
else if(mode==11){addr=Mem4(cp);cp+=4;}
operands[ix]="2,"+addr;continue;}
switch(mode){case 15:addr=Mem4(cp)+ramstart;cp+=4;break;case 14:addr=Mem2(cp)+ramstart;cp+=2;break;case 13:addr=Mem1(cp)+ramstart;cp++;break;case 7:addr=Mem4(cp);cp+=4;break;case 6:addr=Mem2(cp);cp+=2;break;case 5:addr=Mem1(cp);cp++;break;default:fatal_error("Unknown addressing mode in store operand.");}
operands[ix]="1,"+addr;continue;}
else{fatal_error("Unknown operand type.",optype);}}
return cp;}
function compile_func(funcaddr){var addr=funcaddr;var functype=Mem1(addr);if(functype!=0xC0&&functype!=0xC1){if(functype>=0xC0&&functype<=0xDF)
fatal_error("Call to unknown type of function.",addr);else
fatal_error("Call to non-function.",addr);}
addr++;var localsformat=[];var rawstart=addr;var ix=0;while(1){var loctype=Mem1(addr);addr++;var locnum=Mem1(addr);addr++;if(loctype==0){break;}
if(loctype!=1&&loctype!=2&&loctype!=4){fatal_error("Invalid local variable size in function header.",loctype);}
localsformat.push({size:loctype,count:locnum});}
var rawformat=memmap.slice(rawstart,addr);while(rawformat.length%4)
rawformat.push(0);return new VMFunc(funcaddr,addr,localsformat,rawformat);}
function compile_path(vmfunc,startaddr,startiosys){var cp=startaddr;var opcode;var opcodecp;var key;var context={vmfunc:vmfunc,cp:null,curiosys:startiosys,code:[],holduse:{},varsused:{},offstack:[],offloc:[],offlocdirty:[],path_ends:false};var operands={};operands.func_store={};context.code.push("");while(!context.path_ends){opcodecp=cp;opcode=Mem1(cp);if(opcode===undefined)
fatal_error("Tried to compile nonexistent address",cp);cp++;if(opcode&0x80){if(opcode&0x40){opcode&=0x3F;opcode=(opcode*0x100)|Mem1(cp);cp++;opcode=(opcode*0x100)|Mem1(cp);cp++;opcode=(opcode*0x100)|Mem1(cp);cp++;}
else{opcode&=0x7F;opcode=(opcode*0x100)|Mem1(cp);cp++;}}
var oplist=operandlist_table[opcode];if(!oplist)
fatal_error("Encountered unknown opcode.",opcode);cp=parse_operands(context,cp,oplist,operands);context.cp=cp;var ophandler=opcode_table[opcode];if(!ophandler)
fatal_error("Encountered unhandled opcode.",opcode);ophandler(context,operands);for(key in context.holduse){if(context.holduse[key]===true)
context.holduse[key]=false;}
if(vmfunc.pathaddrs[cp]&&!context.path_ends){context.code.push("pc="+cp+";");oputil_unload_offstate(context);context.code.push("return;");context.path_ends=true;}}
if(context.offstack.length)
fatal_error("Path compilation ended with nonempty offstack.",context.offstack.length);if(context.offloc.length)
fatal_error("Path compilation ended with nonempty offloc.",context.offloc.length);{var ls=[];for(key in context.holduse)
ls.push(key);for(key in context.varsused)
ls.push(key);if(ls.length)
context.code[0]="var "+ls.join(",")+";";}
return make_code(context.code.join("\n"));}
function enter_function(addr,argcount){var ix;total_function_calls++;var accelfunc=accel_address_map[addr];if(accelfunc!==undefined){accel_function_calls++;var val=accelfunc(argcount,tempcallargs);pop_callstub(val);return;}
var vmfunc=vmfunc_table[addr];if(vmfunc===undefined){vmfunc=compile_func(addr);if(addr<ramstart)
vmfunc_table[addr]=vmfunc;}
pc=vmfunc.startpc;var newframe=new StackFrame(vmfunc);newframe.depth=stack.length;if(stack.length==0)
newframe.framestart=0;else
newframe.framestart=frame.framestart+frame.framelen+4*frame.valstack.length;stack.push(newframe);frame=newframe;if(vmfunc.functype==0xC0){for(ix=argcount-1;ix>=0;ix--)
frame.valstack.push(tempcallargs[ix]);frame.valstack.push(argcount);}
else{for(ix=0;ix<argcount;ix++){var form=vmfunc.localsindex[ix];if(form===undefined)
break;if(form.size==4)
frame.locals[form.pos]=tempcallargs[ix];else if(form.size==2)
frame.locals[form.pos]=tempcallargs[ix]&0xFFFF;else if(form.size==1)
frame.locals[form.pos]=tempcallargs[ix]&0xFF;}}}
var ReturnedFromMain={dummy:'The top-level function has returned.'};function leave_function(){var olddepth=frame.depth;stack.pop();if(stack.length==0){frame=null;throw ReturnedFromMain;}
frame=stack[stack.length-1];if(frame.depth!=olddepth-1)
fatal_error("Stack inconsistent after function exit.");}
function pop_stack_to(val){while(stack.length&&stack[stack.length-1].framestart>val)
stack.pop();if(stack.length==0)
fatal_error("Stack evaporated during throw.");frame=stack[stack.length-1];val-=(frame.framestart+frame.framelen);if(val<0)
fatal_error("Attempted to throw below the frame value stack.");if(val&3)
fatal_error("Attempted to throw to an unaligned address.");val>>>=2;if(val>frame.valstack.length)
fatal_error("Attempted to throw beyond the frame value stack.");frame.valstack.length=val;}
function pop_callstub(val){var destaddr,desttype;if(isNaN(val))
fatal_error("Function returned undefined value.");var framestart=frame.valstack.pop();if(framestart!=frame.framestart)
fatal_error("Call stub frameptr ("+framestart+") "+"does not match frame ("+frame.framestart+")");pc=frame.valstack.pop();destaddr=frame.valstack.pop();desttype=frame.valstack.pop();switch(desttype){case 0:return;case 1:MemW4(destaddr,val);return;case 2:frame.locals[destaddr]=val;return;case 3:frame.valstack.push(val);return;case 0x11:fatal_error("String-terminator call stub at end of function call.");return;case 0x10:stream_string(0,pc,0xE1,destaddr);return;case 0x12:stream_num(0,pc,true,destaddr);return;case 0x13:stream_string(0,pc,0xE0,destaddr);return;case 0x14:stream_string(0,pc,0xE2,destaddr);return;default:fatal_error("Unrecognized desttype in callstub.",desttype);}}
function store_operand(desttype,destaddr,val){switch(desttype){case 0:return;case 1:MemW4(destaddr,val);return;case 2:frame.locals[destaddr]=val;return;case 3:frame.valstack.push(val);return;default:fatal_error("Unrecognized desttype in callstub.",desttype);}}
function store_operand_by_funcop(funcop,val){if(!funcop)
return;switch(funcop.mode){case 8:frame.valstack.push(val);return;case 0:return;case 11:if(funcop.argsize==4){frame.locals[funcop.addr]=(val);}
else if(funcop.argsize==2){frame.locals[funcop.addr]=(0xffff&val);}
else{frame.locals[funcop.addr]=(0xff&val);}
return;case 15:if(funcop.argsize==4){MemW4(funcop.addr,val);}
else if(funcop.argsize==2){MemW2(funcop.addr,val);}
else{MemW1(funcop.addr,val);}
return;default:fatal_error("Unknown addressing mode in store func by operand.");}}
function set_random(val){if(val==0){random_func=Math.random;}
else{srand_set_seed(val);random_func=srand_get_random;}}
var srand_table=undefined;var srand_index1,srand_index2;function srand_set_seed(seed){var i,ii,k,val,loop;if(srand_table===undefined)
srand_table=Array(55);srand_table[54]=seed;srand_index1=0;srand_index2=31;k=1;for(i=0;i<55;i++){ii=(21*i)%55;srand_table[ii]=k;k=(seed-k)>>>0;seed=srand_table[ii];}
for(loop=0;loop<4;loop++){for(i=0;i<55;i++){val=srand_table[i]-srand_table[(1+i+30)%55];srand_table[i]=val>>>0;}}}
function srand_get_random(){srand_index1=(srand_index1+1)%55;srand_index2=(srand_index2+1)%55;srand_table[srand_index1]=(srand_table[srand_index1]-srand_table[srand_index2])>>>0;return srand_table[srand_index1]/0x100000000;}
var accel_address_map={};var accel_params=[0,0,0,0,0,0,0,0,0];var accel_func_map={1:function func_1_z__region(argc,argv){if(argc<1)
return 0;var addr=argv[0];if(addr<36)
return 0;if(addr>=endmem)
return 0;var tb=Mem1(addr);if(tb>=0xE0){return 3;}
if(tb>=0xC0){return 2;}
if(tb>=0x70&&tb<=0x7F&&addr>=ramstart){return 1;}
return 0;},2:function func_2_cp__tab(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);if(accel_func_map[1](argc,argv)!=1){Glk.glk_put_jstring("\n[** Programming error: tried to find the \".\" of (something) **]\n");return 0;}
var otab=Mem4(obj+16);if(!otab)
return 0;var max=Mem4(otab);otab+=4;return binary_search(id,2,otab,10,max,0,0);},3:function func_3_ra__pr(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);var prop=accel_helper_get_prop(obj,id);if(prop==0)
return 0;return Mem4(prop+4);},4:function func_4_rl__pr(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);var prop=accel_helper_get_prop(obj,id);if(prop==0)
return 0;return 4*Mem2(prop+2);},5:function func_5_oc__cl(argc,argv){var zr,prop,inlist,inlistlen,jx;var obj=((argc>0)?argv[0]:0);var cla=((argc>1)?argv[1]:0);zr=accel_func_map[1](argc,argv);if(zr==3)
return(cla==accel_params[5])?1:0;if(zr==2)
return(cla==accel_params[4])?1:0;if(zr!=1)
return 0;if(cla==accel_params[2]){if(accel_helper_obj_in_class(obj))
return 1;if(obj==accel_params[2])
return 1;if(obj==accel_params[5])
return 1;if(obj==accel_params[4])
return 1;if(obj==accel_params[3])
return 1;return 0;}
if(cla==accel_params[3]){if(accel_helper_obj_in_class(obj))
return 0;if(obj==accel_params[2])
return 0;if(obj==accel_params[5])
return 0;if(obj==accel_params[4])
return 0;if(obj==accel_params[3])
return 0;return 1;}
if((cla==accel_params[5])||(cla==accel_params[4]))
return 0;if(!accel_helper_obj_in_class(cla)){Glk.glk_put_jstring("\n[** Programming error: tried to apply 'ofclass' with non-class **]\n");return 0;}
prop=accel_helper_get_prop(obj,2);if(prop==0)
return 0;inlist=Mem4(prop+4);if(inlist==0)
return 0;inlistlen=Mem2(prop+2);for(jx=0;jx<inlistlen;jx++){if(Mem4(inlist+(4*jx))==cla)
return 1;}
return 0;},6:function func_6_rv__pr(argc,argv){var id=((argc>1)?argv[1]:0);var addr;addr=accel_func_map[3](argc,argv);if(addr==0){if((id>0)&&(id<accel_params[1])){return Mem4(accel_params[8]+(4*id));}
Glk.glk_put_jstring("\n[** Programming error: tried to read (something) **]\n");return 0;}
return Mem4(addr);},7:function func_7_op__pr(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);var indiv_prop_start=accel_params[1];var zr=accel_func_map[1](argc,argv);if(zr==3){if(id==indiv_prop_start+6)
return 1;if(id==indiv_prop_start+7)
return 1;return 0;}
if(zr==2){return((id==indiv_prop_start+5)?1:0);}
if(zr!=1)
return 0;if((id>=indiv_prop_start)&&(id<indiv_prop_start+8)){if(accel_helper_obj_in_class(obj))
return 1;}
return((accel_func_map[3](argc,argv))?1:0);},8:function func_8_cp__tab(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);if(accel_func_map[1](argc,argv)!=1){Glk.glk_put_jstring("\n[** Programming error: tried to find the \".\" of (something) **]\n");return 0;}
var otab=Mem4(obj+4*(3+(accel_params[7]>>2)));if(!otab)
return 0;var max=Mem4(otab);otab+=4;return binary_search(id,2,otab,10,max,0,0);},9:function func_9_ra__pr(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);var prop=accel_helper_get_prop_new(obj,id);if(prop==0)
return 0;return Mem4(prop+4);},10:function func_10_rl__pr(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);var prop=accel_helper_get_prop_new(obj,id);if(prop==0)
return 0;return 4*Mem2(prop+2);},11:function func_11_oc__cl(argc,argv){var zr,prop,inlist,inlistlen,jx;var obj=((argc>0)?argv[0]:0);var cla=((argc>1)?argv[1]:0);zr=accel_func_map[1](argc,argv);if(zr==3)
return(cla==accel_params[5])?1:0;if(zr==2)
return(cla==accel_params[4])?1:0;if(zr!=1)
return 0;if(cla==accel_params[2]){if(accel_helper_obj_in_class(obj))
return 1;if(obj==accel_params[2])
return 1;if(obj==accel_params[5])
return 1;if(obj==accel_params[4])
return 1;if(obj==accel_params[3])
return 1;return 0;}
if(cla==accel_params[3]){if(accel_helper_obj_in_class(obj))
return 0;if(obj==accel_params[2])
return 0;if(obj==accel_params[5])
return 0;if(obj==accel_params[4])
return 0;if(obj==accel_params[3])
return 0;return 1;}
if((cla==accel_params[5])||(cla==accel_params[4]))
return 0;if(!accel_helper_obj_in_class(cla)){Glk.glk_put_jstring("\n[** Programming error: tried to apply 'ofclass' with non-class **]\n");return 0;}
prop=accel_helper_get_prop_new(obj,2);if(prop==0)
return 0;inlist=Mem4(prop+4);if(inlist==0)
return 0;inlistlen=Mem2(prop+2);for(jx=0;jx<inlistlen;jx++){if(Mem4(inlist+(4*jx))==cla)
return 1;}
return 0;},12:function func_12_rv__pr(argc,argv){var id=((argc>1)?argv[1]:0);var addr;addr=accel_func_map[9](argc,argv);if(addr==0){if((id>0)&&(id<accel_params[1])){return Mem4(accel_params[8]+(4*id));}
Glk.glk_put_jstring("\n[** Programming error: tried to read (something) **]\n");return 0;}
return Mem4(addr);},13:function func_13_op__pr(argc,argv){var obj=((argc>0)?argv[0]:0);var id=((argc>1)?argv[1]:0);var indiv_prop_start=accel_params[1];var zr=accel_func_map[1](argc,argv);if(zr==3){if(id==indiv_prop_start+6)
return 1;if(id==indiv_prop_start+7)
return 1;return 0;}
if(zr==2){return((id==indiv_prop_start+5)?1:0);}
if(zr!=1)
return 0;if((id>=indiv_prop_start)&&(id<indiv_prop_start+8)){if(accel_helper_obj_in_class(obj))
return 1;}
return((accel_func_map[9](argc,argv))?1:0);}};var accel_helper_temp_args=[0,0];function accel_helper_obj_in_class(obj)
{return(Mem4(obj+13+accel_params[7])==accel_params[2]);}
function accel_helper_get_prop(obj,id)
{var cla=0;var prop;if(id&0xFFFF0000){cla=Mem4(accel_params[0]+((id&0xFFFF)*4));accel_helper_temp_args[0]=obj;accel_helper_temp_args[1]=cla;if(accel_func_map[5](2,accel_helper_temp_args)==0)
return 0;id=id>>16;obj=cla;}
accel_helper_temp_args[0]=obj;accel_helper_temp_args[1]=id;prop=accel_func_map[2](2,accel_helper_temp_args);if(prop==0)
return 0;if(accel_helper_obj_in_class(obj)&&(cla==0)){if((id<accel_params[1])||(id>=accel_params[1]+8))
return 0;}
if(Mem4(accel_params[6])!=obj){if(Mem1(prop+9)&1)
return 0;}
return prop;}
function accel_helper_get_prop_new(obj,id)
{var cla=0;var prop;if(id&0xFFFF0000){cla=Mem4(accel_params[0]+((id&0xFFFF)*4));accel_helper_temp_args[0]=obj;accel_helper_temp_args[1]=cla;if(accel_func_map[11](2,accel_helper_temp_args)==0)
return 0;id=id>>16;obj=cla;}
accel_helper_temp_args[0]=obj;accel_helper_temp_args[1]=id;prop=accel_func_map[8](2,accel_helper_temp_args);if(prop==0)
return 0;if(accel_helper_obj_in_class(obj)&&(cla==0)){if((id<accel_params[1])||(id>=accel_params[1]+8))
return 0;}
if(Mem4(accel_params[6])!=obj){if(Mem1(prop+9)&1)
return 0;}
return prop;}
function set_string_table(addr){if(stringtable==addr)
return;decoding_tree=undefined;vmstring_table=undefined;stringtable=addr;if(stringtable==0){return;}
var textenv=vmtextenv_table[stringtable];if(textenv===undefined){var dectab=undefined;var tablelen=Mem4(stringtable);var rootaddr=Mem4(stringtable+8);var cache_stringtable=(stringtable+tablelen<=ramstart);if(cache_stringtable){var tmparray=Array(1);build_decoding_tree(tmparray,rootaddr,4,0);dectab=tmparray[0];if(dectab===undefined)
fatal_error("Failed to create decoding tree.");}
textenv=new VMTextEnv(stringtable,dectab);vmtextenv_table[stringtable]=textenv;}
decoding_tree=textenv.decoding_tree;vmstring_table=textenv.vmstring_tables[iosysmode];}
function set_iosys(mode,rock){switch(mode){case 0:rock=0;break;case 1:break;case 2:rock=0;break;default:mode=0;rock=0;break;}
iosysmode=mode;iosysrock=rock;var textenv=vmtextenv_table[stringtable];if(textenv===undefined)
vmstring_table=undefined;else
vmstring_table=textenv.vmstring_tables[iosysmode];}
function build_decoding_tree(cablist,nodeaddr,depth,mask){var ix,type,cab;var depthbit;type=Mem1(nodeaddr);if(type==0&&depth==4){cab=Array(16);cab.type=0;cab.depth=4;cablist[mask]=cab;build_decoding_tree(cab,nodeaddr,0,0);return;}
if(type==0){var leftaddr=Mem4(nodeaddr+1);var rightaddr=Mem4(nodeaddr+5);build_decoding_tree(cablist,leftaddr,depth+1,mask);build_decoding_tree(cablist,rightaddr,depth+1,(mask|(1<<depth)));return;}
nodeaddr++;cab={};cab.type=type;cab.depth=depth;switch(type){case 0x02:cab.value=Mem1(nodeaddr);cab.cchar=CharToString(cab.value);break;case 0x04:cab.value=Mem4(nodeaddr);cab.cchar=CharToString(cab.value);break;case 0x03:case 0x05:cab.addr=nodeaddr;break;case 0x08:case 0x09:cab.addr=Mem4(nodeaddr);break;case 0x0A:case 0x0B:cab.addr=nodeaddr;break;case 0x01:break;default:fatal_error("Unknown node type in string table.",type);}
depthbit=(1<<depth);for(ix=mask;ix<16;ix+=depthbit){cablist[ix]=cab;}}
function stream_num(nextcp,value,inmiddle,charnum){var buf=(value&0xffffffff).toString(10);switch(iosysmode){case 2:if(charnum)
buf=buf.slice(charnum);Glk.glk_put_jstring(buf,true);break;case 1:if(!inmiddle){frame.valstack.push(0x11,0,nextcp,frame.framestart);inmiddle=true;}
if(charnum<buf.length){var ch=buf.charCodeAt(charnum);frame.valstack.push(0x12,charnum+1,value,frame.framestart);tempcallargs[0]=ch;enter_function(iosysrock,1);return true;}
break;case 0:break;}
if(inmiddle){var desttype,destaddr;if(frame.valstack.pop()!=frame.framestart)
fatal_error("Call stub frameptr does not match frame.");pc=frame.valstack.pop();destaddr=frame.valstack.pop();desttype=frame.valstack.pop();if(desttype!=0x11)
fatal_error("String-on-string call stub while printing number.");}}
function stream_string(nextcp,addr,inmiddle,bitnum){var substring=(inmiddle!=0);var addrkey,strop,res;var desttype,destaddr;while(true){strop=undefined;if(inmiddle==0)
addrkey=addr;else
addrkey=addr+"/"+inmiddle+"/"+bitnum;if(vmstring_table!==undefined&&addr<ramstart){strop=vmstring_table[addrkey];if(strop===undefined){strop=compile_string(iosysmode,addr,inmiddle,bitnum);vmstring_table[addrkey]=strop;strings_compiled++;strings_cached++;}}
else{strop=compile_string(iosysmode,addr,inmiddle,bitnum);strings_compiled++;}
if(!(strop instanceof Function)){Glk.glk_put_jstring(strop);if(!substring)
return false;}
else{res=strop(nextcp,substring);if(res instanceof Array){substring=true;addr=res[0];inmiddle=res[1];bitnum=res[2];continue;}
if(res){return true;}}
if(frame.valstack.pop()!=frame.framestart)
fatal_error("Call stub frameptr does not match frame.");pc=frame.valstack.pop();destaddr=frame.valstack.pop();desttype=frame.valstack.pop();if(desttype==0x11){return true;}
else if(desttype==0x10){substring=true;bitnum=destaddr;inmiddle=0xE1;addr=pc;}
else{fatal_error("Function-terminator call stub at end of string.");}}}
function compile_string(curiosys,startaddr,inmiddle,startbitnum){var addr=startaddr;var bitnum=startbitnum;var retval=undefined;var ch,type;if(!addr)
fatal_error("Called compile_string with null address.");var context={startaddr:startaddr,startbitnum:startbitnum,buffer:[],code:[]}
if(inmiddle==0){type=Mem1(addr);if(type==0xE2)
addr+=4;else
addr++;bitnum=0;}
else{type=inmiddle;}
if(type==0xE1){if(decoding_tree){var bits,numbits,readahead,tmpaddr;var cablist,cab;var done=false;bits=Mem1(addr);if(bitnum)
bits>>=bitnum;numbits=(8-bitnum);readahead=false;if(!(decoding_tree instanceof Array)){done=true;}
cablist=decoding_tree;while(!done){if(numbits<4){var newbyte=Mem1(addr+1);bits|=(newbyte<<numbits);numbits+=8;readahead=true;}
cab=cablist[bits&0x0F];numbits-=cab.depth;bits>>=cab.depth;bitnum+=cab.depth;if(bitnum>=8){addr+=1;bitnum-=8;if(readahead){readahead=false;}
else{var newbyte=Mem1(addr);bits|=(newbyte<<numbits);numbits+=8;}}
if(cab instanceof Array){cablist=cab;continue;}
switch(cab.type){case 0x01:done=true;break;case 0x02:case 0x04:switch(curiosys){case 2:context.buffer.push(cab.cchar);break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);context.code.push("tempcallargs[0]="+cab.value+";");context.code.push("enter_function(iosysrock, 1);");retval=true;done=true;break;}
cablist=decoding_tree;break;case 0x03:switch(curiosys){case 2:tmpaddr=cab.addr;while(true){ch=Mem1(tmpaddr);if(ch==0)
break;context.buffer.push(CharToString(ch));tmpaddr++;}
break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);retval="["+(cab.addr)+", 0xE0, 0]";done=true;break;}
cablist=decoding_tree;break;case 0x05:switch(curiosys){case 2:tmpaddr=cab.addr;while(true){ch=Mem4(tmpaddr);if(ch==0)
break;context.buffer.push(CharToString(ch));tmpaddr+=4;}
break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);retval="["+(cab.addr)+", 0xE2, 0]";done=true;break;}
cablist=decoding_tree;break;case 0x08:case 0x09:case 0x0A:case 0x0B:oputil_flush_string(context);oputil_push_substring_callstub(context);context.code.push("var otype, retval;");context.code.push("var oaddr = "+(cab.addr)+";");if(cab.type>=0x09)
context.code.push("oaddr = Mem4(oaddr);");if(cab.type==0x0B)
context.code.push("oaddr = Mem4(oaddr);");context.code.push("otype = Mem1(oaddr);");retval="retval";done=true;oputil_push_callstub(context,"0x10,"+bitnum,addr);context.code.push("if (otype >= 0xE0 && otype <= 0xFF) {");context.code.push("retval = [oaddr, 0, 0];");context.code.push("}");context.code.push("else if (otype >= 0xC0 && otype <= 0xDF) {");var argc=0;if(cab.type==0x0A||cab.type==0x0B){argc=Mem4(cab.addr+4);for(var ix=0;ix<argc;ix++)
context.code.push("tempcallargs["+ix+"]="+Mem4(cab.addr+8+4*ix)+";");}
context.code.push("enter_function(oaddr, "+argc+");");context.code.push("retval = true;");context.code.push("}");context.code.push("else {");context.code.push("fatal_error('Unknown object while decoding string indirect reference.', otype);");context.code.push("}");break;default:fatal_error("Unknown entity in string decoding (cached).");break;}}}
else{var node,byt,nodetype;var done=false;if(!stringtable)
fatal_error("Attempted to print a compressed string with no table set.");byt=Mem1(addr);if(bitnum)
byt>>=bitnum;node=Mem4(stringtable+8);while(!done){nodetype=Mem1(node);node++;switch(nodetype){case 0x00:if(byt&1)
node=Mem4(node+4);else
node=Mem4(node+0);if(bitnum==7){bitnum=0;addr++;byt=Mem1(addr);}
else{bitnum++;byt>>=1;}
break;case 0x01:retval=false;done=true;break;case 0x02:ch=Mem1(node);switch(curiosys){case 2:context.buffer.push(CharToString(ch));break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);context.code.push("tempcallargs[0]="+ch+";");context.code.push("enter_function(iosysrock, 1);");retval=true;done=true;break;}
node=Mem4(stringtable+8);break;case 0x04:ch=Mem4(node);switch(curiosys){case 2:context.buffer.push(CharToString(ch));break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);context.code.push("tempcallargs[0]="+ch+";");context.code.push("enter_function(iosysrock, 1);");retval=true;done=true;break;}
node=Mem4(stringtable+8);break;case 0x03:switch(curiosys){case 2:while(true){ch=Mem1(node);if(ch==0)
break;context.buffer.push(CharToString(ch));node++;}
break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);retval="["+node+", 0xE0, 0]";done=true;break;}
node=Mem4(stringtable+8);break;case 0x05:switch(curiosys){case 2:while(true){ch=Mem4(node);if(ch==0)
break;context.buffer.push(CharToString(ch));node+=4;}
break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);oputil_push_callstub(context,"0x10,"+bitnum,addr);retval="["+node+", 0xE2, 0]";done=true;break;}
node=Mem4(stringtable+8);break;case 0x08:case 0x09:case 0x0A:case 0x0B:oputil_flush_string(context);oputil_push_substring_callstub(context);context.code.push("var otype, retval;");context.code.push("var oaddr = "+Mem4(node)+";");if(nodetype==0x09||nodetype==0x0B)
context.code.push("oaddr = Mem4(oaddr);");context.code.push("otype = Mem1(oaddr);");retval="retval";done=true;oputil_push_callstub(context,"0x10,"+bitnum,addr);context.code.push("if (otype >= 0xE0 && otype <= 0xFF) {");context.code.push("retval = [oaddr, 0, 0];");context.code.push("}");context.code.push("else if (otype >= 0xC0 && otype <= 0xDF) {");var argc=0;if(nodetype==0x0A||nodetype==0x0B){argc=Mem4(node+4);for(var ix=0;ix<argc;ix++)
context.code.push("tempcallargs["+ix+"]="+Mem4(node+8+4*ix)+";");}
context.code.push("enter_function(oaddr, "+argc+");");context.code.push("retval = true;");context.code.push("}");context.code.push("else {");context.code.push("fatal_error('Unknown object while decoding string indirect reference.', otype);");context.code.push("}");break;default:fatal_error("Unknown entity in string decoding.",nodetype);break;}}}}
else if(type==0xE0){var ch;switch(curiosys){case 2:while(1){ch=Mem1(addr);addr++;if(ch==0)
break;context.buffer.push(CharToString(ch));}
break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);ch=Mem1(addr);addr++;if(ch!=0){oputil_push_callstub(context,"0x13,0",addr);context.code.push("tempcallargs[0]="+ch+";");context.code.push("enter_function(iosysrock, 1);");retval=true;}
else{retval="false";}
break;}}
else if(type==0xE2){var ch;switch(curiosys){case 2:while(1){ch=Mem4(addr);addr+=4;if(ch==0)
break;context.buffer.push(CharToString(ch));}
break;case 1:oputil_flush_string(context);oputil_push_substring_callstub(context);ch=Mem4(addr);addr+=4;if(ch!=0){oputil_push_callstub(context,"0x14,0",addr);context.code.push("tempcallargs[0]="+ch+";");context.code.push("enter_function(iosysrock, 1);");retval=true;}
else{retval="false";}
break;}}
else if(type>=0xE0&&type<=0xFF){fatal_error("Attempt to print unknown type of string.");}
else{fatal_error("Attempt to print non-string.");}
if(!retval){return context.buffer.join("");}
else{oputil_flush_string(context);context.code.push("return "+retval+";");return make_code(context.code.join("\n"),"nextcp,substring");}}
function do_gestalt(val,val2){var ix;switch(val){case 0:return 0x00030102;case 1:return 0x00010301;case 2:return 1;case 3:return 1;case 4:switch(val2){case 0:return 1;case 1:return 1;case 2:return 1;default:return 0;}
break;case 5:return 1;case 6:return 1;case 7:return 1;case 8:return heap_get_start();case 9:return 1;case 10:if(accel_func_map[val2])
return 1;else
return 0;case 11:return 1;default:return 0;}}
var tempsearchkey=[];function fetch_search_key(addr,len,options){var ix;tempsearchkey.length=len;if(options&1){for(ix=0;ix<len;ix++)
tempsearchkey[ix]=Mem1(addr+ix);}
else{switch(len){case 4:tempsearchkey[0]=(addr>>24)&0xFF;tempsearchkey[1]=(addr>>16)&0xFF;tempsearchkey[2]=(addr>>8)&0xFF;tempsearchkey[3]=addr&0xFF;break;case 2:tempsearchkey[0]=(addr>>8)&0xFF;tempsearchkey[1]=addr&0xFF;break;case 1:tempsearchkey[0]=addr&0xFF;break;default:throw('Direct search key must hold one, two, or four bytes.');}}
return tempsearchkey;}
function linear_search(key,keysize,start,structsize,numstructs,keyoffset,options){var ix,count,match,byt;var retindex=((options&4)!=0);var zeroterm=((options&2)!=0);var keybuf=fetch_search_key(key,keysize,options);for(count=0;count<numstructs;count++,start+=structsize){match=true;for(ix=0;match&&ix<keysize;ix++){byt=Mem1(start+keyoffset+ix);if(byt!=keybuf[ix])
match=false;}
if(match){if(retindex)
return count;else
return start;}
if(zeroterm){match=true;for(ix=0;match&&ix<keysize;ix++){byt=Mem1(start+keyoffset+ix);if(byt!=0)
match=false;}
if(match){break;}}}
if(retindex)
return 0xFFFFFFFF;else
return 0;}
function binary_search(key,keysize,start,structsize,numstructs,keyoffset,options){var top,bot,addr,val,cmp,ix;var byt,byt2;var retindex=((options&4)!=0);var keybuf=fetch_search_key(key,keysize,options);bot=0;top=numstructs;while(bot<top){cmp=0;val=(top+bot)>>1;addr=start+val*structsize;for(ix=0;(!cmp)&&ix<keysize;ix++){byt=Mem1(addr+keyoffset+ix);byt2=keybuf[ix];if(byt<byt2)
cmp=-1;else if(byt>byt2)
cmp=1;}
if(!cmp){if(retindex)
return val;else
return addr;}
if(cmp<0){bot=val+1;}
else{top=val;}}
if(retindex)
return 0xFFFFFFFF;else
return 0;}
function linked_search(key,keysize,start,keyoffset,nextoffset,options){var ix,byt,match;var zeroterm=((options&2)!=0);var keybuf=fetch_search_key(key,keysize,options);while(start!=0){match=true;for(ix=0;match&&ix<keysize;ix++){byt=Mem1(start+keyoffset+ix);if(byt!=keybuf[ix])
match=false;}
if(match){return start;}
if(zeroterm){match=true;for(ix=0;match&&ix<keysize;ix++){byt=Mem1(start+keyoffset+ix);if(byt!=0)
match=false;}
if(match){break;}}
start=Mem4(start+nextoffset);}
return 0;}
function decode_float(val){var sign,res,expo;if(val&0x80000000){sign=true;val=val&0x7fffffff;}
else{sign=false;}
if(val==0){return(sign?-0.0:0.0);}
if((val&0x7f800000)==0x7f800000){if((val&0x7fffff)==0){return(sign?-Infinity:Infinity);}
else{return(sign?-NaN:NaN);}}
expo=(val>>23&0xff);if(expo){res=((val&0x7fffff|0x800000)/8388608*Math.pow(2,(expo-127)));}
else{res=((val&0x7fffff)/8388608*Math.pow(2,-126));}
if(sign)
return-res;else
return res;}
function encode_float(val){var absval,fbits;var mant,expo,sign;if(isNaN(val)){return 0x7f800001;}
if(!isFinite(val)){if(val<0)
return 0xff800000;else
return 0x7f800000;}
if(val==0){if(1/val<0)
return 0x80000000;else
return 0x0;}
if(val<0){sign=true;absval=-val;}
else{sign=false;absval=val;}
expo=Math.floor(Math.log(absval)/Math.log(2));mant=absval/Math.pow(2,expo);if(expo>=128){return(sign?0xff800000:0x7f800000);}
else if(expo<-126){mant=mant*Math.pow(2,126+expo);expo=0;}
else if(!(expo==0&&mant==0.0)){expo+=127;mant-=1.0;}
mant=mant*8388608.0;fbits=(mant+0.4999999999999999)<<0;if(fbits>=8388608){fbits=0;expo++;if(expo>=255){return(sign?0xff800000:0x7f800000);}}
if(sign)
return((0x80000000)|(expo<<23)|(fbits))>>>0;else
return(expo<<23)|(fbits);}
var game_image=null;var game_signature=null;var opt_rethrow_exceptions=null;var memmap;var stack;var frame;var vm_started=false;var vm_stopped=false;var tempcallargs;var tempglkargs;var done_executing;var vmfunc_table;var vmtextenv_table;var decoding_tree;var vmstring_table;var random_func;var ramstart;var endgamefile;var origendmem;var stacksize;var startfuncaddr;var origstringtable;var checksum;var pc;var stringtable;var endmem;var protectstart,protectend;var iosysmode,iosysrock;var undostack;var resumefuncop,resumevalue;var heapstart;var usedlist;var freelist;var total_execution_time=0;var total_function_calls=0;var accel_function_calls=0;var total_path_calls=0;var paths_cached=0;var paths_compiled=0;var strings_cached=0;var strings_compiled=0;function setup_vm(){var val,version;if(!game_image)
fatal_error("There is no Glulx game file loaded.");vm_started=true;resumefuncop=null;resumevalue=0;memmap=null;stack=[];frame=null;pc=0;if(game_image.length<36)
fatal_error("This is too short to be a valid Glulx file.");val=ByteRead4(game_image,0);if(val!=0x476c756c)
fatal_error("This is not a valid Glulx file.");version=ByteRead4(game_image,4);if(version<0x20000)
fatal_error("This Glulx file is too old a version to execute.");if(version>=0x30200)
fatal_error("This Glulx file is too new a version to execute.");ramstart=ByteRead4(game_image,8);endgamefile=ByteRead4(game_image,12);origendmem=ByteRead4(game_image,16);stacksize=ByteRead4(game_image,20);startfuncaddr=ByteRead4(game_image,24);origstringtable=ByteRead4(game_image,28);checksum=ByteRead4(game_image,32);protectstart=0;protectend=0;if(ramstart<0x100||endgamefile<ramstart||origendmem<endgamefile)
fatal_error("The segment boundaries in the header are in an impossible order.");if(endgamefile!=game_image.length)
fatal_error("The game file length does not agree with the header.");done_executing=false;vmfunc_table={};vmtextenv_table={};decoding_tree=undefined;vmstring_table=undefined;tempcallargs=Array(8);tempglkargs=Array(1);set_random(0);endmem=origendmem;stringtable=0;undostack=[];heapstart=0;usedlist=[];freelist=[];vm_restart();}
function vm_restart(){var ix;heap_clear();var protect=copy_protected_range();memmap=null;memmap=game_image.slice(0,endgamefile);endmem=memmap.length;change_memsize(origendmem,false);paste_protected_range(protect);stack=[];frame=null;pc=0;iosysmode=0;iosysrock=0;set_string_table(origstringtable);enter_function(startfuncaddr,0);}
function compress_bytes(arr){result=[];var i=0;while(i<arr.length){var zeroes=0;while(i<arr.length&&arr[i]==0&&zeroes<=255){zeroes++;i++;}
if(zeroes>0){result.push(0);result.push(zeroes-1);}
while(i<arr.length&&arr[i]!=0){result.push(arr[i]);i++;}}
return result;}
function decompress_bytes(arr){result=[];var i=0;while(i<arr.length){var b=arr[i++];if(b==0){var count=arr[i++]+1;for(var j=0;j<count;j++){result.push(0);}}else{result.push(b);}}
return result;}
function pack_iff_chunks(chunks){keys=[];for(var key in chunks){if(key.length!=4){fatal_error("Bad chunk ID (must be exactly 4 chars): "+key);}
keys.push(key);}
keys.sort();bytes=[];for(var ix=0;ix<keys.length;ix++){var key=keys[ix];var chunk=chunks[key];BytePushString(bytes,key);BytePush4(bytes,chunk.length);bytes=bytes.concat(chunk);}
return bytes;}
function unpack_iff_chunks(bytes){chunks={};var pos=0;while(pos<bytes.length){if((pos+8)>bytes.length){qlog("IFF chunk header is truncated");return undefined;}
var key=ByteReadString(bytes,pos,4);var size=ByteRead4(bytes,pos+4);pos+=8;if((pos+size)>bytes.length){qlog(key+" chunk is truncated "+"("+size+" bytes needed, "+(bytes.length-pos)+" available");return undefined;}
chunks[key]=bytes.slice(pos,pos+size);pos+=size;}
return chunks;}
function vm_save(streamid){if(iosysmode!=2)
fatal_error("Streams are only available in Glk I/O system.");var str=GiDispa.class_obj_from_id('stream',streamid);if(!str)
return false;chunks={};chunks["IFhd"]=game_image.slice(0,128);var cmem=memmap.slice(ramstart);for(var i=ramstart;i<game_image.length;i++){cmem[i-ramstart]^=game_image[i];}
cmem=compress_bytes(cmem);cmem.splice(0,0,0,0,0,0);ByteWrite4(cmem,0,endmem);chunks["CMem"]=cmem;chunks["Stks"]=[];for(var i=0;i<stack.length;i++){push_serialized_stackframe(stack[i],chunks["Stks"]);}
if(heap_is_active()){chunks["MAll"]=[];BytePush4(chunks["MAll"],heapstart);BytePush4(chunks["MAll"],usedlist.length);for(var i=0;i<usedlist.length;i++){BytePush4(chunks["MAll"],usedlist[i].addr);BytePush4(chunks["MAll"],usedlist[i].size);}}
var payload_bytes=[]
BytePushString(payload_bytes,"IFZS");payload_bytes=payload_bytes.concat(pack_iff_chunks(chunks));var quetzal=pack_iff_chunks({"FORM":payload_bytes})
Glk.glk_put_buffer_stream(str,quetzal);return true;}
function vm_restore(streamid){if(iosysmode!=2)
fatal_error("Streams are only available in Glk I/O system.");var str=GiDispa.class_obj_from_id('stream',streamid);if(!str)
return false;var quetzal=new Array(0);var buffer=new Array(1024);var count=1;while(count>0){count=Glk.glk_get_buffer_stream(str,buffer);quetzal=quetzal.concat(buffer.slice(0,count));}
quetzal=unpack_iff_chunks(quetzal);if(!quetzal){qlog("vm_restore failed: file is not Quetzal");return false;}
quetzal=quetzal["FORM"];if(!quetzal||ByteReadString(quetzal,0,4)!="IFZS"){qlog("vm_restore failed: file doesn't start with FORM/IFZS header");return false;}
var chunks=unpack_iff_chunks(quetzal.slice(4));if(!chunks["IFhd"]){qlog("vm_restore failed: missing required IFhd chunk");return false;}
for(var i=0;i<128;i++){if(chunks["IFhd"][i]!=game_image[i]){qlog("vm_restore failed: this save image is for a different game");return false;}}
if(!chunks["CMem"]){qlog("vm_restore failed: missing required CMem chunk");return false;}
if(!chunks["Stks"]){qlog("vm_restore failed: missing required Stks chunk");return false;}
var protect=copy_protected_range();heap_clear();var newendmem=ByteRead4(chunks["CMem"],0);var ram_xor=chunks["CMem"].slice(4);ram_xor=decompress_bytes(ram_xor);while(ram_xor.length<newendmem-ramstart)
ram_xor.push(0);change_memsize(newendmem,false);memmap=game_image.slice(0,ramstart).concat(ram_xor);for(var i=ramstart;i<game_image.length;i++){memmap[i]^=game_image[i];}
var stackchunk=chunks["Stks"];stack=[];while(stackchunk.length){frame=pop_deserialized_stackframe(stackchunk);if(!frame){fatal_error("vm_restore failed: bad stack frame");}
stack.unshift(frame);}
for(var i=0;i<stack.length;i++){stack[i].depth=i;}
frame=stack[stack.length-1];var heapchunk=chunks["MAll"];if(heapchunk&&heapchunk.length>=8){heapstart=ByteRead4(heapchunk,0);var numblocks=ByteRead4(heapchunk,4);for(var i=0;i<numblocks;i++){var addr=ByteRead4(heapchunk,8+8*i);var size=ByteRead4(heapchunk,12+8*i);usedlist.push(new HeapBlock(addr,size));}
usedlist.sort(function(blk1,blk2){return blk1.addr-blk2.addr;});var heapend=heapstart;for(var i=0;i<usedlist.length;i++){var addr=usedlist[i].addr;var size=usedlist[i].size;if(addr<heapend||(addr+size)>endmem){fatal_error("vm_restore failed: corrupt dynamic heap");}
if(addr>heapend){freelist.push(new HeapBlock(heapend,addr-heapend));}
heapend=addr+size;}
if(heapend<endmem){freelist.push(new HeapBlock(heapend,endmem-heapend));}}
paste_protected_range(protect);return true;}
function vm_saveundo(){var snapshot={};snapshot.ram=memmap.slice(ramstart);snapshot.endmem=endmem;snapshot.pc=pc;snapshot.stack=[];for(var i=0;i<stack.length;i++){snapshot.stack[i]=clone_stackframe(stack[i]);}
snapshot.heapstart=heapstart;snapshot.usedlist=usedlist.slice(0);snapshot.freelist=freelist.slice(0);undostack.push(snapshot);if(undostack.length>10){undostack.shift();}}
function vm_restoreundo(){if(undostack.length==0){return false;}
var snapshot=undostack.pop();var protect=copy_protected_range();memmap=memmap.slice(0,ramstart).concat(snapshot.ram);endmem=snapshot.endmem;stack=snapshot.stack;frame=stack[stack.length-1];pc=snapshot.pc;heapstart=snapshot.heapstart;usedlist=snapshot.usedlist;freelist=snapshot.freelist;paste_protected_range(protect);return true;}
function change_memsize(newlen,internal){var lx;if(newlen==endmem)
return;if((!internal)&&heap_is_active())
fatal_error("Cannot resize Glulx memory space while heap is active.");if(newlen<origendmem)
fatal_error("Cannot resize Glulx memory space smaller than it started.");if(newlen&0xFF)
fatal_error("Can only resize Glulx memory space to a 256-byte boundary.");memmap.length=newlen;if(newlen>endmem){for(lx=endmem;lx<newlen;lx++){memmap[lx]=0;}}
endmem=newlen;}
function copy_protected_range(){if(protectstart>=protectend)
return null;var len=protectend-protectstart;var obj={start:protectstart,end:protectend,len:len};var arr=memmap.slice(protectstart,protectend);while(arr.length<len)
arr.push(0);obj.mem=arr;return obj;}
function paste_protected_range(obj){if(!obj)
return;var ix,addr;var arr=obj.mem;var start=obj.start;var end=obj.end;if(end>endmem)
end=endmem;for(ix=0,addr=start;addr<end;ix++,addr++){memmap[addr]=arr[ix];}}
function perform_verify(){var imagelen=game_image.length;var ix,newsum,checksum;if(imagelen<0x100||(imagelen&0xFF)!=0)
return 1;if(imagelen!=ByteRead4(game_image,12))
return 1;checksum=ByteRead4(game_image,32);newsum=(-checksum)>>>0;for(ix=0;ix<imagelen;ix+=4){newsum=(newsum+ByteRead4(game_image,ix))>>>0;}
if(newsum!=checksum)
return 1;return 0;}
function quixe_get_signature(){return game_signature;}
function quixe_get_statistics(){var stat={game_image_length:game_image.length,total_execution_time:total_execution_time,total_function_calls:total_function_calls,accel_function_calls:accel_function_calls,total_path_calls:total_path_calls,paths_cached:paths_cached,paths_compiled:paths_compiled,strings_cached:strings_cached,strings_compiled:strings_compiled};return stat;}
function heap_clear(){heapstart=0;usedlist=[];freelist=[];}
function heap_is_active(){return(usedlist.length>0);}
function heap_get_start(){return heapstart;}
function HeapBlock(addr,size){this.addr=addr;this.size=size;this.end=addr+size;}
function heap_binary_search(list,addr){var low=0;var high=list.length;while(low<high){var mid=(low+high)>>1;if(list[mid].addr<addr){low=mid+1;}else{high=mid;}}
return low;}
function heap_malloc(size){if(!heap_is_active()){heapstart=endmem;}
for(var i=0,max=freelist.length;i<max;i++){var freeblock=freelist[i];if(freeblock.size>=size){if(freeblock.size>size){freelist[i]=new HeapBlock(freeblock.addr+size,freeblock.size-size);}else{freelist.splice(i,1);}
var pos=heap_binary_search(usedlist,freeblock.addr);usedlist.splice(pos,0,new HeapBlock(freeblock.addr,size));return freeblock.addr;}}
var addr=endmem;var rounded_up_size=((size+0xFF)&0xFFFFFF00);change_memsize(endmem+rounded_up_size,true);if(rounded_up_size>size){freelist.push(new HeapBlock(addr+size,rounded_up_size-size));}
usedlist.push(new HeapBlock(addr,size));return addr;}
function heap_free(addr){var pos=heap_binary_search(usedlist,addr);var block=usedlist[pos];if(!block||block.addr!=addr){fatal_error("Tried to free non-existent block");}
usedlist.splice(pos,1);if(usedlist.length==0){change_memsize(heapstart,true);heap_clear();return;}
pos=heap_binary_search(freelist,addr);var next=freelist[pos];if(next&&next.addr==block.end){block=new HeapBlock(addr,block.size+next.size);freelist.splice(pos,1);}
var prev=freelist[pos-1];if(prev&&prev.end==block.addr){block=new HeapBlock(prev.addr,prev.size+block.size);freelist.splice(pos-1,1);pos-=1;}
freelist.splice(pos,0,block);}
function assert_heap_valid(){if(!heap_is_active()){if(heapstart!=0)
fatal_error("Heap inconsistency: heapstart nonzero");if(usedlist.length>0)
fatal_error("Heap inconsistency: usedlist nonempty");if(freelist.length>0)
fatal_error("Heap inconsistency: usedlist nonempty");return;}
if(heapstart==0)
fatal_error("Heap inconsistency: heapstart is zero");var addr=heapstart;var upos=0,fpos=0;while(upos<usedlist.length||fpos<freelist.length){var u=usedlist[upos];var f=freelist[fpos];if(u&&u.addr==addr){addr+=u.size;upos++;}else if(f&&f.addr==addr){addr+=f.size;fpos++;}else{fatal_error("Heap inconsistency: no block at address "+addr);}}
if(addr!=endmem)
fatal_error("Heap inconsistency: overrun at end of heap");}
var debuginfo={map:{},functions:[],functionmap:{}};function quixe_get_debuginfo(){return debuginfo;}
function parse_inform_debug_data(datachunknum){var el=GiLoad.find_data_chunk(datachunknum);if(!el)
return;var buf=el.data;var done;var pos,oldpos;if(!(buf[0]==0xDE&&buf[1]==0xBF&&buf[2]==0&&buf[3]==0))
return;var informversion=(buf[4]<<8)|(buf[5]);pos=6;done=false;while(!done){var rectype=buf[pos++];switch(rectype){case 0:case undefined:done=true;break;case 1:var filenum=buf[pos++];oldpos=pos;while(buf[pos]){pos++};var includename=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;oldpos=pos;while(buf[pos]){pos++};var filename=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 2:oldpos=pos;while(buf[pos]){pos++};var classname=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;var linestart=buf.slice(pos,pos+4);pos+=4;var lineend=buf.slice(pos,pos+4);pos+=4;break;case 3:var objnum=(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var objname=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;var linestart=buf.slice(pos,pos+4);pos+=4;var lineend=buf.slice(pos,pos+4);pos+=4;break;case 4:var num=(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 5:var num=(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 6:var num=(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 7:var num=(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 8:var num=(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 9:pos+=64;break;case 10:var funcnum=(buf[pos++]<<8)|(buf[pos++]);var seqcount=(buf[pos++]<<8)|(buf[pos++]);pos+=seqcount*6;break;case 11:var funcnum=(buf[pos++]<<8)|(buf[pos++]);var line=buf.slice(pos,pos+4);pos+=4;var funcaddr=(buf[pos++]<<16)|(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var funcname=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;var locals=[];while(buf[pos]){oldpos=pos;while(buf[pos]){pos++};var locname=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;locals.push(locname);}
pos++;debuginfo.functions.push({num:funcnum,name:funcname,addr:funcaddr,locals:locals});break;case 12:var arrayaddr=(buf[pos++]<<8)|(buf[pos++]);oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;break;case 13:while(buf[pos]){oldpos=pos;while(buf[pos]){pos++};var name=String.fromCharCode.apply(this,buf.slice(oldpos,pos));pos++;var addr=(buf[pos++]<<16)|(buf[pos++]<<8)|(buf[pos++]);debuginfo.map[name]=addr;}
pos++;break;case 14:var funcnum=(buf[pos++]<<8)|(buf[pos++]);var line=buf.slice(pos,pos+4);pos+=4;var endaddr=(buf[pos++]<<16)|(buf[pos++]<<8)|(buf[pos++]);break;default:qlog("Unknown record type in debug data: "+rectype);done=true;break;}}
var funcbase=debuginfo.map["code area"];if(funcbase){var ix;for(ix=0;ix<debuginfo.functions.length;ix++){var func=debuginfo.functions[ix];debuginfo.functionmap[funcbase+func.addr]=func;}}}
function execute_loop(){var vmfunc,pathtab,path;var pathstart,pathend;if(resumefuncop){store_operand_by_funcop(resumefuncop,resumevalue);resumefuncop=null;resumevalue=0;}
pathstart=new Date().getTime();while(!done_executing){vmfunc=frame.vmfunc;pathtab=vmfunc[iosysmode];path=pathtab[pc];if(path===undefined){vmfunc.pathaddrs[pc]=true;path=compile_path(vmfunc,pc,iosysmode);paths_compiled++;if(pc<ramstart){pathtab[pc]=path;paths_cached++;}}
total_path_calls++;try{path();}
catch(ex){if(ex===ReturnedFromMain){done_executing=true;vm_stopped=true;}
else{throw ex;}}}
pathend=new Date().getTime();total_execution_time+=(pathend-pathstart)/1000.0;if(vm_stopped){Glk.glk_exit();}
Glk.update();qlog("### done executing; path time = "+(pathend-pathstart)+" ms");}
return{version:'1.3.1',prepare:quixe_prepare,init:quixe_init,resume:quixe_resume,get_signature:quixe_get_signature,get_statistics:quixe_get_statistics,get_debuginfo:quixe_get_debuginfo,ReadByte:ReadArgByte,WriteByte:WriteArgByte,ReadWord:ReadArgWord,WriteWord:WriteArgWord,ReadStructField:ReadStructField,WriteStructField:WriteStructField,SetResumeStore:SetResumeStore};}();GiDispa=function(){var VM=null;function set_vm(vm_api){VM=vm_api;}
var class_defs={0:'window',1:'stream',2:'fileref',3:'schannel'};function FuncSpec(id,name,proto){this.id=id;this.name=name;this.proto=proto;}
function Prototype(args,retarg){this.args=args;this.retarg=retarg;}
function ArgString(){this.macro='Byte';this.refsize=1;}
function ArgUnicode(){this.macro='Word';this.refsize=4;}
function ArgChar(signed){this.signed=signed;this.macro='Byte';this.refsize=1;this.literal=(signed?'arg_char_signed':'arg_char_unsigned');}
function ArgInt(signed){this.signed=signed;this.macro='Word';this.refsize=4;this.literal=(signed?'arg_int_signed':'arg_int_unsigned');}
function ArgClass(name){this.name=name;this.macro='Word';this.refsize=4;}
function ArgStruct(form){this.form=form;}
function ArgRef(arg,passin,passout,nonnull){this.arg=arg;this.passin=passin;this.passout=passout;this.nonnull=nonnull;}
function ArgArray(arg,retained,passin,passout,nonnull){this.arg=arg;this.retained=retained;this.passin=passin;this.passout=passout;this.nonnull=nonnull;}
var arg_int_unsigned=new ArgInt(false);var arg_int_signed=new ArgInt(true);var arg_char_unsigned=new ArgChar(false);var arg_char_native=new ArgChar(null);var arg_char_signed=new ArgChar(true);var arg_class_window=new ArgClass("window");var arg_class_stream=new ArgClass("stream");var arg_class_fileref=new ArgClass("fileref");var arg_class_schannel=new ArgClass("schannel");var proto_map={1:new FuncSpec(1,"exit",new Prototype([],null)),3:new FuncSpec(3,"tick",new Prototype([],null)),4:new FuncSpec(4,"gestalt",new Prototype([arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),5:new FuncSpec(5,"gestalt_ext",new Prototype([arg_int_unsigned,arg_int_unsigned,new ArgArray(arg_int_unsigned,false,true,true,false)],new ArgRef(arg_int_unsigned,false,true,true))),32:new FuncSpec(32,"window_iterate",new Prototype([arg_class_window,new ArgRef(arg_int_unsigned,false,true,false)],new ArgRef(arg_class_window,false,true,true))),33:new FuncSpec(33,"window_get_rock",new Prototype([arg_class_window],new ArgRef(arg_int_unsigned,false,true,true))),34:new FuncSpec(34,"window_get_root",new Prototype([],new ArgRef(arg_class_window,false,true,true))),35:new FuncSpec(35,"window_open",new Prototype([arg_class_window,arg_int_unsigned,arg_int_unsigned,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_window,false,true,true))),36:new FuncSpec(36,"window_close",new Prototype([arg_class_window,new ArgRef(new ArgStruct(new Prototype([arg_int_unsigned,arg_int_unsigned],null)),false,true,false)],null)),37:new FuncSpec(37,"window_get_size",new Prototype([arg_class_window,new ArgRef(arg_int_unsigned,false,true,false),new ArgRef(arg_int_unsigned,false,true,false)],null)),38:new FuncSpec(38,"window_set_arrangement",new Prototype([arg_class_window,arg_int_unsigned,arg_int_unsigned,arg_class_window],null)),39:new FuncSpec(39,"window_get_arrangement",new Prototype([arg_class_window,new ArgRef(arg_int_unsigned,false,true,false),new ArgRef(arg_int_unsigned,false,true,false),new ArgRef(arg_class_window,false,true,false)],null)),40:new FuncSpec(40,"window_get_type",new Prototype([arg_class_window],new ArgRef(arg_int_unsigned,false,true,true))),41:new FuncSpec(41,"window_get_parent",new Prototype([arg_class_window],new ArgRef(arg_class_window,false,true,true))),42:new FuncSpec(42,"window_clear",new Prototype([arg_class_window],null)),43:new FuncSpec(43,"window_move_cursor",new Prototype([arg_class_window,arg_int_unsigned,arg_int_unsigned],null)),44:new FuncSpec(44,"window_get_stream",new Prototype([arg_class_window],new ArgRef(arg_class_stream,false,true,true))),45:new FuncSpec(45,"window_set_echo_stream",new Prototype([arg_class_window,arg_class_stream],null)),46:new FuncSpec(46,"window_get_echo_stream",new Prototype([arg_class_window],new ArgRef(arg_class_stream,false,true,true))),47:new FuncSpec(47,"set_window",new Prototype([arg_class_window],null)),48:new FuncSpec(48,"window_get_sibling",new Prototype([arg_class_window],new ArgRef(arg_class_window,false,true,true))),64:new FuncSpec(64,"stream_iterate",new Prototype([arg_class_stream,new ArgRef(arg_int_unsigned,false,true,false)],new ArgRef(arg_class_stream,false,true,true))),65:new FuncSpec(65,"stream_get_rock",new Prototype([arg_class_stream],new ArgRef(arg_int_unsigned,false,true,true))),66:new FuncSpec(66,"stream_open_file",new Prototype([arg_class_fileref,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_stream,false,true,true))),67:new FuncSpec(67,"stream_open_memory",new Prototype([new ArgArray(arg_char_native,true,true,true,false),arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_stream,false,true,true))),68:new FuncSpec(68,"stream_close",new Prototype([arg_class_stream,new ArgRef(new ArgStruct(new Prototype([arg_int_unsigned,arg_int_unsigned],null)),false,true,false)],null)),69:new FuncSpec(69,"stream_set_position",new Prototype([arg_class_stream,arg_int_signed,arg_int_unsigned],null)),70:new FuncSpec(70,"stream_get_position",new Prototype([arg_class_stream],new ArgRef(arg_int_unsigned,false,true,true))),71:new FuncSpec(71,"stream_set_current",new Prototype([arg_class_stream],null)),72:new FuncSpec(72,"stream_get_current",new Prototype([],new ArgRef(arg_class_stream,false,true,true))),73:new FuncSpec(73,"stream_open_resource",new Prototype([arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_stream,false,true,true))),96:new FuncSpec(96,"fileref_create_temp",new Prototype([arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_fileref,false,true,true))),97:new FuncSpec(97,"fileref_create_by_name",new Prototype([arg_int_unsigned,new ArgString(),arg_int_unsigned],new ArgRef(arg_class_fileref,false,true,true))),98:new FuncSpec(98,"fileref_create_by_prompt",new Prototype([arg_int_unsigned,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_fileref,false,true,true))),99:new FuncSpec(99,"fileref_destroy",new Prototype([arg_class_fileref],null)),100:new FuncSpec(100,"fileref_iterate",new Prototype([arg_class_fileref,new ArgRef(arg_int_unsigned,false,true,false)],new ArgRef(arg_class_fileref,false,true,true))),101:new FuncSpec(101,"fileref_get_rock",new Prototype([arg_class_fileref],new ArgRef(arg_int_unsigned,false,true,true))),102:new FuncSpec(102,"fileref_delete_file",new Prototype([arg_class_fileref],null)),103:new FuncSpec(103,"fileref_does_file_exist",new Prototype([arg_class_fileref],new ArgRef(arg_int_unsigned,false,true,true))),104:new FuncSpec(104,"fileref_create_from_fileref",new Prototype([arg_int_unsigned,arg_class_fileref,arg_int_unsigned],new ArgRef(arg_class_fileref,false,true,true))),128:new FuncSpec(128,"put_char",new Prototype([arg_char_unsigned],null)),129:new FuncSpec(129,"put_char_stream",new Prototype([arg_class_stream,arg_char_unsigned],null)),130:new FuncSpec(130,"put_string",new Prototype([new ArgString()],null)),131:new FuncSpec(131,"put_string_stream",new Prototype([arg_class_stream,new ArgString()],null)),132:new FuncSpec(132,"put_buffer",new Prototype([new ArgArray(arg_char_native,false,true,false,true)],null)),133:new FuncSpec(133,"put_buffer_stream",new Prototype([arg_class_stream,new ArgArray(arg_char_native,false,true,false,true)],null)),134:new FuncSpec(134,"set_style",new Prototype([arg_int_unsigned],null)),135:new FuncSpec(135,"set_style_stream",new Prototype([arg_class_stream,arg_int_unsigned],null)),144:new FuncSpec(144,"get_char_stream",new Prototype([arg_class_stream],new ArgRef(arg_int_signed,false,true,true))),145:new FuncSpec(145,"get_line_stream",new Prototype([arg_class_stream,new ArgArray(arg_char_native,false,false,true,true)],new ArgRef(arg_int_unsigned,false,true,true))),146:new FuncSpec(146,"get_buffer_stream",new Prototype([arg_class_stream,new ArgArray(arg_char_native,false,false,true,true)],new ArgRef(arg_int_unsigned,false,true,true))),160:new FuncSpec(160,"char_to_lower",new Prototype([arg_char_unsigned],new ArgRef(arg_char_unsigned,false,true,true))),161:new FuncSpec(161,"char_to_upper",new Prototype([arg_char_unsigned],new ArgRef(arg_char_unsigned,false,true,true))),176:new FuncSpec(176,"stylehint_set",new Prototype([arg_int_unsigned,arg_int_unsigned,arg_int_unsigned,arg_int_signed],null)),177:new FuncSpec(177,"stylehint_clear",new Prototype([arg_int_unsigned,arg_int_unsigned,arg_int_unsigned],null)),178:new FuncSpec(178,"style_distinguish",new Prototype([arg_class_window,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),179:new FuncSpec(179,"style_measure",new Prototype([arg_class_window,arg_int_unsigned,arg_int_unsigned,new ArgRef(arg_int_unsigned,false,true,false)],new ArgRef(arg_int_unsigned,false,true,true))),192:new FuncSpec(192,"select",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_unsigned,arg_class_window,arg_int_unsigned,arg_int_unsigned],null)),false,true,true)],null)),193:new FuncSpec(193,"select_poll",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_unsigned,arg_class_window,arg_int_unsigned,arg_int_unsigned],null)),false,true,true)],null)),208:new FuncSpec(208,"request_line_event",new Prototype([arg_class_window,new ArgArray(arg_char_native,true,true,true,true),arg_int_unsigned],null)),209:new FuncSpec(209,"cancel_line_event",new Prototype([arg_class_window,new ArgRef(new ArgStruct(new Prototype([arg_int_unsigned,arg_class_window,arg_int_unsigned,arg_int_unsigned],null)),false,true,false)],null)),210:new FuncSpec(210,"request_char_event",new Prototype([arg_class_window],null)),211:new FuncSpec(211,"cancel_char_event",new Prototype([arg_class_window],null)),212:new FuncSpec(212,"request_mouse_event",new Prototype([arg_class_window],null)),213:new FuncSpec(213,"cancel_mouse_event",new Prototype([arg_class_window],null)),214:new FuncSpec(214,"request_timer_events",new Prototype([arg_int_unsigned],null)),224:new FuncSpec(224,"image_get_info",new Prototype([arg_int_unsigned,new ArgRef(arg_int_unsigned,false,true,false),new ArgRef(arg_int_unsigned,false,true,false)],new ArgRef(arg_int_unsigned,false,true,true))),225:new FuncSpec(225,"image_draw",new Prototype([arg_class_window,arg_int_unsigned,arg_int_signed,arg_int_signed],new ArgRef(arg_int_unsigned,false,true,true))),226:new FuncSpec(226,"image_draw_scaled",new Prototype([arg_class_window,arg_int_unsigned,arg_int_signed,arg_int_signed,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),232:new FuncSpec(232,"window_flow_break",new Prototype([arg_class_window],null)),233:new FuncSpec(233,"window_erase_rect",new Prototype([arg_class_window,arg_int_signed,arg_int_signed,arg_int_unsigned,arg_int_unsigned],null)),234:new FuncSpec(234,"window_fill_rect",new Prototype([arg_class_window,arg_int_unsigned,arg_int_signed,arg_int_signed,arg_int_unsigned,arg_int_unsigned],null)),235:new FuncSpec(235,"window_set_background_color",new Prototype([arg_class_window,arg_int_unsigned],null)),240:new FuncSpec(240,"schannel_iterate",new Prototype([arg_class_schannel,new ArgRef(arg_int_unsigned,false,true,false)],new ArgRef(arg_class_schannel,false,true,true))),241:new FuncSpec(241,"schannel_get_rock",new Prototype([arg_class_schannel],new ArgRef(arg_int_unsigned,false,true,true))),242:new FuncSpec(242,"schannel_create",new Prototype([arg_int_unsigned],new ArgRef(arg_class_schannel,false,true,true))),243:new FuncSpec(243,"schannel_destroy",new Prototype([arg_class_schannel],null)),244:new FuncSpec(244,"schannel_create_ext",new Prototype([arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_schannel,false,true,true))),247:new FuncSpec(247,"schannel_play_multi",new Prototype([new ArgArray(arg_class_schannel,false,true,false,true),new ArgArray(arg_int_unsigned,false,true,false,true),arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),248:new FuncSpec(248,"schannel_play",new Prototype([arg_class_schannel,arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),249:new FuncSpec(249,"schannel_play_ext",new Prototype([arg_class_schannel,arg_int_unsigned,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),250:new FuncSpec(250,"schannel_stop",new Prototype([arg_class_schannel],null)),251:new FuncSpec(251,"schannel_set_volume",new Prototype([arg_class_schannel,arg_int_unsigned],null)),252:new FuncSpec(252,"sound_load_hint",new Prototype([arg_int_unsigned,arg_int_unsigned],null)),253:new FuncSpec(253,"schannel_set_volume_ext",new Prototype([arg_class_schannel,arg_int_unsigned,arg_int_unsigned,arg_int_unsigned],null)),254:new FuncSpec(254,"schannel_pause",new Prototype([arg_class_schannel],null)),255:new FuncSpec(255,"schannel_unpause",new Prototype([arg_class_schannel],null)),256:new FuncSpec(256,"set_hyperlink",new Prototype([arg_int_unsigned],null)),257:new FuncSpec(257,"set_hyperlink_stream",new Prototype([arg_class_stream,arg_int_unsigned],null)),258:new FuncSpec(258,"request_hyperlink_event",new Prototype([arg_class_window],null)),259:new FuncSpec(259,"cancel_hyperlink_event",new Prototype([arg_class_window],null)),288:new FuncSpec(288,"buffer_to_lower_case_uni",new Prototype([new ArgArray(arg_int_unsigned,false,true,true,true),arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),289:new FuncSpec(289,"buffer_to_upper_case_uni",new Prototype([new ArgArray(arg_int_unsigned,false,true,true,true),arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),290:new FuncSpec(290,"buffer_to_title_case_uni",new Prototype([new ArgArray(arg_int_unsigned,false,true,true,true),arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),291:new FuncSpec(291,"buffer_canon_decompose_uni",new Prototype([new ArgArray(arg_int_unsigned,false,true,true,true),arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),292:new FuncSpec(292,"buffer_canon_normalize_uni",new Prototype([new ArgArray(arg_int_unsigned,false,true,true,true),arg_int_unsigned],new ArgRef(arg_int_unsigned,false,true,true))),296:new FuncSpec(296,"put_char_uni",new Prototype([arg_int_unsigned],null)),297:new FuncSpec(297,"put_string_uni",new Prototype([new ArgUnicode()],null)),298:new FuncSpec(298,"put_buffer_uni",new Prototype([new ArgArray(arg_int_unsigned,false,true,false,true)],null)),299:new FuncSpec(299,"put_char_stream_uni",new Prototype([arg_class_stream,arg_int_unsigned],null)),300:new FuncSpec(300,"put_string_stream_uni",new Prototype([arg_class_stream,new ArgUnicode()],null)),301:new FuncSpec(301,"put_buffer_stream_uni",new Prototype([arg_class_stream,new ArgArray(arg_int_unsigned,false,true,false,true)],null)),304:new FuncSpec(304,"get_char_stream_uni",new Prototype([arg_class_stream],new ArgRef(arg_int_signed,false,true,true))),305:new FuncSpec(305,"get_buffer_stream_uni",new Prototype([arg_class_stream,new ArgArray(arg_int_unsigned,false,false,true,true)],new ArgRef(arg_int_unsigned,false,true,true))),306:new FuncSpec(306,"get_line_stream_uni",new Prototype([arg_class_stream,new ArgArray(arg_int_unsigned,false,false,true,true)],new ArgRef(arg_int_unsigned,false,true,true))),312:new FuncSpec(312,"stream_open_file_uni",new Prototype([arg_class_fileref,arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_stream,false,true,true))),313:new FuncSpec(313,"stream_open_memory_uni",new Prototype([new ArgArray(arg_int_unsigned,true,true,true,false),arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_stream,false,true,true))),314:new FuncSpec(314,"stream_open_resource_uni",new Prototype([arg_int_unsigned,arg_int_unsigned],new ArgRef(arg_class_stream,false,true,true))),320:new FuncSpec(320,"request_char_event_uni",new Prototype([arg_class_window],null)),321:new FuncSpec(321,"request_line_event_uni",new Prototype([arg_class_window,new ArgArray(arg_int_unsigned,true,true,true,true),arg_int_unsigned],null)),336:new FuncSpec(336,"set_echo_line_event",new Prototype([arg_class_window,arg_int_unsigned],null)),337:new FuncSpec(337,"set_terminators_line_event",new Prototype([arg_class_window,new ArgArray(arg_int_unsigned,false,true,false,false)],null)),352:new FuncSpec(352,"current_time",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_unsigned,arg_int_signed],null)),false,true,true)],null)),353:new FuncSpec(353,"current_simple_time",new Prototype([arg_int_unsigned],new ArgRef(arg_int_signed,false,true,true))),360:new FuncSpec(360,"time_to_date_utc",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_unsigned,arg_int_signed],null)),true,false,true),new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),false,true,true)],null)),361:new FuncSpec(361,"time_to_date_local",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_unsigned,arg_int_signed],null)),true,false,true),new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),false,true,true)],null)),362:new FuncSpec(362,"simple_time_to_date_utc",new Prototype([arg_int_signed,arg_int_unsigned,new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),false,true,true)],null)),363:new FuncSpec(363,"simple_time_to_date_local",new Prototype([arg_int_signed,arg_int_unsigned,new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),false,true,true)],null)),364:new FuncSpec(364,"date_to_time_utc",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),true,false,true),new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_unsigned,arg_int_signed],null)),false,true,true)],null)),365:new FuncSpec(365,"date_to_time_local",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),true,false,true),new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_unsigned,arg_int_signed],null)),false,true,true)],null)),366:new FuncSpec(366,"date_to_simple_time_utc",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),true,false,true),arg_int_unsigned],new ArgRef(arg_int_signed,false,true,true))),367:new FuncSpec(367,"date_to_simple_time_local",new Prototype([new ArgRef(new ArgStruct(new Prototype([arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed,arg_int_signed],null)),true,false,true),arg_int_unsigned],new ArgRef(arg_int_signed,false,true,true)))};function convert_arg(arg,passin,val){if(arg instanceof ArgInt){if(passin){if(!arg.signed)
return val;else
return val+' & 0xFFFFFFFF';}
else{return'0';}}
if(arg instanceof ArgChar){if(passin){if(!arg.signed)
return val+' & 0xFF';else
return'cast_signed_char('+val+')'}
else{return'0';}}
if(arg instanceof ArgClass){if(passin){return'class_obj_from_id("'+arg.name+'", '+val+')';}
else{return'null';}}
return'???';}
function unconvert_arg(arg,val){if(arg instanceof ArgInt){return val+' >>> 0';}
if(arg instanceof ArgChar){if(!arg.signed)
return val+' & 0xFF';else
return'uncast_signed_char('+val+')'}
if(arg instanceof ArgClass){return'class_obj_to_id("'+arg.name+'", '+val+')';}
return'???';}
function cast_signed_char(val){val=val&0xFF;if(val&0x80)
val-=0x100;return val;}
function uncast_signed_char(val){val=val&0xFF;if(val&0x80)
val+=0xFFFFFF00;return val;}
function class_obj_to_id(clas,val){if(!val)
return 0;return val.disprock;}
function class_obj_from_id(clas,val){if(val==0)
return null;return class_map[clas][val];}
function build_function(func){var ix,jx;var form,retarg,argpos,argjoin,subargs;var arg,refarg,tmpvar,val,retval,ls;var mayblock;var out=[];var locals={};var arraycount=0;out.push('// no local vars');out.push('// '+func.id+': '+func.name);form=func.proto;retarg=null;if(form.retarg)
retarg=form.retarg.arg;mayblock=Glk.call_may_not_return(func.id);argpos=0;argjoin=[];for(ix=0;ix<form.args.length;ix++){arg=form.args[ix];tmpvar='glka'+ix;argjoin.push(tmpvar);locals[tmpvar]=true;if((arg instanceof ArgInt)||(arg instanceof ArgChar)||(arg instanceof ArgClass)){val=convert_arg(arg,true,'callargs['+argpos+']');out.push(tmpvar+' = '+val+';');argpos+=1;}
else if(arg instanceof ArgRef){refarg=arg.arg;out.push('if (callargs['+argpos+'] == 0) {');if(arg.nonnull)
out.push('  throw("glk '+func.name+': null argument");');else
out.push('  '+tmpvar+' = null;');out.push('} else {');if((refarg instanceof ArgInt)||(refarg instanceof ArgChar)||(refarg instanceof ArgClass)){out.push('  '+tmpvar+' = new Glk.RefBox();');val=convert_arg(refarg,arg.passin,'VM.ReadWord(callargs['+argpos+'])');out.push('  '+tmpvar+'.set_value('+val+');');}
else if(refarg instanceof ArgStruct){subargs=refarg.form.args;out.push('  '+tmpvar+' = new Glk.RefStruct('+subargs.length+');');for(jx=0;jx<subargs.length;jx++){val=convert_arg(subargs[jx],arg.passin,'VM.ReadStructField(callargs['+argpos+'], '+jx+')');out.push('  '+tmpvar+'.push_field('+val+');');}}
else{throw('buildfunc: unsupported refarg type: '+func.name);}
out.push('}');argpos+=1;}
else if(arg instanceof ArgArray){locals['glklen']=true;refarg=arg.arg;out.push('if (callargs['+argpos+'] == 0) {');if(arg.nonnull)
out.push('  throw("glk '+func.name+': null argument");');else
out.push('  '+tmpvar+' = null;');out.push('} else {');out.push('  glklen = callargs['+(argpos+1)+'];');out.push('  '+tmpvar+' = Array(glklen);');if(arg.passin){locals['ix']=true;locals['jx']=true;out.push('  for (ix=0, jx=callargs['+argpos+']; ix<glklen; ix++, jx+='+refarg.refsize+') {');val=convert_arg(refarg,true,'VM.Read'+refarg.macro+'(jx)');out.push('    '+tmpvar+'[ix] = '+val+';');out.push('  }');}
if(arg.retained){if(arraycount==0)
out.push('  temp_arg_arrays.length = 0;');arraycount+=1;out.push('  make_arg_array('+tmpvar+', callargs['+argpos+'], glklen, '+refarg.literal+');');}
out.push('}');argpos+=2;}
else if((arg instanceof ArgString)||(arg instanceof ArgUnicode)){locals['ix']=true;locals['jx']=true;var confunc,checkbyte;if(arg instanceof ArgString){checkbyte='0xE0';confunc='byte_array_to_string';}
else{checkbyte='0xE2';confunc='uni_array_to_string';}
out.push(tmpvar+' = Array();');out.push('jx = callargs['+argpos+'];');out.push('if (VM.ReadByte(jx) != '+checkbyte+') throw("glk '+func.name+': string argument must be unencoded");');out.push('for (jx+='+arg.refsize+'; true; jx+='+arg.refsize+') {');out.push('  ix = VM.Read'+arg.macro+'(jx);');out.push('  if (ix == 0) break;');out.push('  '+tmpvar+'.push(ix);');out.push('}');out.push(tmpvar+' = Glk.'+confunc+'('+tmpvar+');');argpos+=1;}
else{throw('buildfunc: unsupported arg type: '+func.name);}}
out.push('if (callargs.length != '+argpos+') throw "glk '+func.name+': wrong number of arguments";');if(retarg||mayblock){locals['glkret']=true;retval='glkret = ';}
else{retval='';}
out.push(retval+'Glk.glk_'+func.name+'('+argjoin.join(', ')+');');if(mayblock){out.push('if (glkret === Glk.DidNotReturn) {');out.push('  set_blocked_selector('+func.id+', callargs);');out.push('  return glkret;');out.push('}');}
argpos=0;for(ix=0;ix<form.args.length;ix++){arg=form.args[ix];tmpvar='glka'+ix;if((arg instanceof ArgInt)||(arg instanceof ArgChar)||(arg instanceof ArgClass)){argpos+=1;}
else if(arg instanceof ArgRef){refarg=arg.arg;if(arg.passout){out.push('if ('+tmpvar+') {');if((refarg instanceof ArgInt)||(refarg instanceof ArgChar)||(refarg instanceof ArgClass)){val=unconvert_arg(refarg,tmpvar+'.get_value()');out.push('  VM.WriteWord(callargs['+argpos+'], '+val+');');}
else if(refarg instanceof ArgStruct){subargs=refarg.form.args;for(jx=0;jx<subargs.length;jx++){val=unconvert_arg(subargs[jx],tmpvar+'.get_field('+jx+')');out.push('  VM.WriteStructField(callargs['+argpos+'], '+jx+', '+val+');');}}
else{throw('buildfunc: unsupported refarg type: '+func.name);}
out.push('}');}
argpos+=1;}
else if(arg instanceof ArgArray){refarg=arg.arg;if(arg.passout&&!arg.retained){out.push('if ('+tmpvar+') {');locals['ix']=true;locals['jx']=true;out.push('  for (ix=0, jx=callargs['+argpos+']; ix<glklen; ix++, jx+='+refarg.refsize+') {');val=unconvert_arg(refarg,tmpvar+'[ix]');out.push('    VM.Write'+refarg.macro+'(jx, '+val+')');out.push('  }');out.push('}');}
argpos+=2;}
else if((arg instanceof ArgString)||(arg instanceof ArgUnicode)){argpos+=1;}
else{throw('buildfunc: unsupported arg type: '+func.name);}}
if(arraycount!=0)
out.push('temp_arg_arrays.length = 0;');if(retarg){val=unconvert_arg(retarg,'glkret');out.push('return '+val+';');}
else{out.push('return 0;');}
ls=[];for(val in locals)
ls.push(val);if(ls.length)
out[0]='var '+ls.join(', ')+';';val=out.join('\n');eval('function _func(callargs) {\n'+val+'\n}');return _func;}
var function_map={};function get_function(id){var proto;var func=function_map[id];if(func===undefined){proto=proto_map[id];if(proto===undefined)
throw('dispatch: unknown Glk function: '+id);func=build_function(proto);function_map[id]=func;}
return func;}
var blocked_selector=null;var blocked_callargs=null;function set_blocked_selector(sel,args){blocked_selector=sel;blocked_callargs=args.slice(0);}
function prepare_resume(glka0){if(blocked_selector==0x0C0){if(blocked_callargs[0]!=0){VM.WriteStructField(blocked_callargs[0],0,glka0.get_field(0)>>>0);VM.WriteStructField(blocked_callargs[0],1,class_obj_to_id("window",glka0.get_field(1)));VM.WriteStructField(blocked_callargs[0],2,glka0.get_field(2)>>>0);VM.WriteStructField(blocked_callargs[0],3,glka0.get_field(3)>>>0);}}
else if(blocked_selector==0x062){VM.SetResumeStore(class_obj_to_id("fileref",glka0));}
blocked_selector=null;blocked_callargs=null;}
var temp_arg_arrays=[];var retained_arrays=[];function make_arg_array(arr,addr,len,arg){var obj;if(!arr)
return;obj={arr:arr,addr:addr,len:len,arg:arg};temp_arg_arrays.push(obj);}
function retain_array(arr){var ix,obj;if(!arr)
return;obj=undefined;for(ix=0;ix<temp_arg_arrays.length;ix++){if(temp_arg_arrays[ix].arr===arr){obj=temp_arg_arrays[ix];break;}}
if(obj===undefined)
throw('retain_array: array is not an argument');for(ix=0;!(retained_arrays[ix]===undefined);ix++){};retained_arrays[ix]=obj;}
function unretain_array(arr){var ix,jx,obj;if(!arr)
return;obj=undefined;for(ix=0;ix<retained_arrays.length;ix++){if(retained_arrays[ix]===undefined)
continue;if(retained_arrays[ix].arr===arr){obj=retained_arrays[ix];delete retained_arrays[ix];break;}}
if(obj===undefined)
throw('unretain_array: array was never retained');if(obj.arg instanceof ArgInt){for(ix=0,jx=obj.addr;ix<obj.len;ix++,jx+=4){VM.WriteWord(jx,obj.arr[ix]>>>0);}}
else if(obj.arg instanceof ArgChar){if(!obj.arg.signed){for(ix=0,jx=obj.addr;ix<obj.len;ix++,jx++){VM.WriteByte(jx,obj.arr[ix]&0xFF);}}
else{for(ix=0,jx=obj.addr;ix<obj.len;ix++,jx++){VM.WriteByte(jx,uncast_signed_char(obj.arr[ix]));}}}
else{throw('unretain_array: unsupported refarg type');}}
var class_map={};var last_used_id;function class_register(clas,obj){if(obj.disprock)
throw('class_register: object is already registered');obj.disprock=last_used_id;last_used_id++;class_map[clas][obj.disprock]=obj;}
function class_unregister(clas,obj){if(!obj.disprock||class_map[clas][obj.disprock]===undefined)
throw('class_unregister: object is not registered');delete class_map[clas][obj.disprock];obj.disprock=undefined;}
function init_module(){var ix,key;last_used_id=1+Math.round(Math.random()*1000);for(ix in class_defs){key=class_defs[ix];class_map[key]={};}};init_module();return{set_vm:set_vm,get_function:get_function,prepare_resume:prepare_resume,class_register:class_register,class_unregister:class_unregister,class_obj_to_id:class_obj_to_id,class_obj_from_id:class_obj_from_id,retain_array:retain_array,unretain_array:unretain_array};}();GiLoad=function(){var all_options={vm:null,io:null,spacing:4,use_query_story:true,default_story:null,set_page_title:true,proxy_url:'http://zcode.appspot.com/proxy/'};var gameurl=null;var metadata={};var datachunks={};function load_run(optobj,image,image_format){all_options.vm=window.Quixe;all_options.io=window.Glk;if(!optobj)
optobj=window.game_options;if(optobj)
Object.extend(all_options,optobj);gameurl=null;if(all_options.use_query_story){var qparams=get_query_params();gameurl=qparams['story'];}
if(!gameurl&&image){GlkOte.log('### trying pre-loaded load ('+image_format+')...');switch(image_format){case'base64':image=decode_base64(image);break;case'raw':image=decode_text(image);break;case'array':break;default:all_options.io.fatal_error("Could not decode story file data: "+image_format);return;}
start_game(image);return;}
if(!gameurl){gameurl=all_options.default_story;}
if(!gameurl){all_options.io.fatal_error("No story file specified!");return;}
GlkOte.log('### gameurl: '+gameurl);image=null;image_format=null;var xhr=Ajax.getTransport();var binary_supported=(xhr.overrideMimeType!==undefined&&!Prototype.Browser.Opera);var crossorigin_supported=(xhr.withCredentials!==undefined);xhr=null;var regex_urldomain=/^(file:|(\w+:)?\/\/[^\/?#]+)/;var page_domain=regex_urldomain.exec(location)[0];var data_exec=regex_urldomain.exec(gameurl);var is_relative=data_exec?false:true;var data_domain=data_exec?data_exec[0]:page_domain;var same_origin=(page_domain==data_domain);if(navigator.userAgent.match(/chrome/i)&&data_domain=='file:'){same_origin=false;}
var old_js_url=gameurl.toLowerCase().endsWith('.js');GlkOte.log('### is_relative='+is_relative+', same_origin='+same_origin+', binary_supported='+binary_supported+', crossorigin_supported='+crossorigin_supported);if(old_js_url&&same_origin){GlkOte.log('### trying old-fashioned load...');window.processBase64Zcode=function(val){start_game(decode_base64(val));};new Ajax.Request(gameurl,{method:'get',evalJS:'force',onFailure:function(resp){all_options.io.fatal_error("The story could not be loaded. ("+gameurl+"): Error "+resp.status+": "+resp.statusText);}});return;}
if(old_js_url){GlkOte.log('### trying script load...');window.processBase64Zcode=function(val){start_game(decode_base64(val));};var headls=$$('head');if(!headls||headls.length==0){all_options.io.fatal_error("This page has no <head> element!");return;}
var script=new Element('script',{src:gameurl,'type':"text/javascript"});headls[0].insert(script);return;}
if(binary_supported&&same_origin){GlkOte.log('### trying binary load...');new Ajax.Request(gameurl,{method:'get',onCreate:function(resp){resp.transport.overrideMimeType('text/plain; charset=x-user-defined');},onSuccess:function(resp){start_game(decode_raw_text(resp.responseText));},onFailure:function(resp){all_options.io.fatal_error("The story could not be loaded. ("+gameurl+"): Error "+resp.status+": "+resp.statusText);}});return;}
if(data_domain=='file:'){all_options.io.fatal_error("The story could not be loaded. ("+gameurl+"): A local file cannot be sent to the proxy.");return;}
var absgameurl=gameurl;if(is_relative){absgameurl=absolutize(gameurl);GlkOte.log('### absolutize '+gameurl+' to '+absgameurl);}
if(crossorigin_supported){GlkOte.log('### trying proxy load... ('+all_options.proxy_url+')');new Ajax.Request(all_options.proxy_url,{method:'get',parameters:{encode:'base64',url:absgameurl},onFailure:function(resp){all_options.io.fatal_error("The story could not be loaded. ("+gameurl+"): Error "+resp.status+": "+resp.statusText);},onSuccess:function(resp){start_game(decode_base64(resp.responseText));}});return;}
if(true){var fullurl=all_options.proxy_url+'?encode=base64&callback=processBase64Zcode&url='+absgameurl;GlkOte.log('### trying proxy-script load... ('+fullurl+')');window.processBase64Zcode=function(val){start_game(decode_base64(val));};var headls=$$('head');if(!headls||headls.length==0){all_options.io.fatal_error("This page has no <head> element!");return;}
var script=new Element('script',{src:fullurl,'type':"text/javascript"});headls[0].insert(script);return;}
all_options.io.fatal_error("The story could not be loaded. ("+gameurl+"): I don't know how to load this data.");}
function get_query_params(){var map={};var qs=location.search.substring(1,location.search.length);if(qs.length){var args=qs.split('&');qs=qs.replace(/\+/g,' ');for(var ix=0;ix<args.length;ix++){var pair=args[ix].split('=');var name=decodeURIComponent(pair[0]);var value=(pair.length==2)?decodeURIComponent(pair[1]):name;map[name]=value;}}
return map;}
function absolutize(url){var div=new Element('div');div.innerHTML='<a></a>';div.firstChild.href=url;div.innerHTML=div.innerHTML;return div.firstChild.href;}
function find_data_chunk(val){return datachunks[val];}
function unpack_blorb(image){var len=image.length;var ix;var rindex=[];var result=null;var pos=12;while(pos<len){var chunktype=String.fromCharCode(image[pos+0],image[pos+1],image[pos+2],image[pos+3]);pos+=4;var chunklen=(image[pos+0]<<24)|(image[pos+1]<<16)|(image[pos+2]<<8)|(image[pos+3]);pos+=4;if(chunktype=="RIdx"){var npos=pos;var numchunks=(image[npos+0]<<24)|(image[npos+1]<<16)|(image[npos+2]<<8)|(image[npos+3]);npos+=4;for(ix=0;ix<numchunks;ix++){var chunkusage=String.fromCharCode(image[npos+0],image[npos+1],image[npos+2],image[npos+3]);npos+=4;var chunknum=(image[npos+0]<<24)|(image[npos+1]<<16)|(image[npos+2]<<8)|(image[npos+3]);npos+=4;var chunkpos=(image[npos+0]<<24)|(image[npos+1]<<16)|(image[npos+2]<<8)|(image[npos+3]);npos+=4;rindex.push({usage:chunkusage,num:chunknum,pos:chunkpos});}}
if(chunktype=="IFmd"){var arr=image.slice(pos,pos+chunklen);var dat=String.fromCharCode.apply(this,arr);dat=dat.replace(/<title>/gi,'<xtitle>');dat=dat.replace(/<\/title>/gi,'</xtitle>');var met=new Element('metadata').update(dat);if(met.down('bibliographic')){var els=met.down('bibliographic').childElements();var el;for(ix=0;ix<els.length;ix++){el=els[ix];if(el.tagName.toLowerCase()=='xtitle')
metadata.title=el.textContent;else
metadata[el.tagName.toLowerCase()]=el.textContent;}}}
pos+=chunklen;if(pos&1)
pos++;}
for(ix=0;ix<rindex.length;ix++){var el=rindex[ix];pos=el.pos;var chunktype=String.fromCharCode(image[pos+0],image[pos+1],image[pos+2],image[pos+3]);pos+=4;var chunklen=(image[pos+0]<<24)|(image[pos+1]<<16)|(image[pos+2]<<8)|(image[pos+3]);pos+=4;if(el.usage=="Exec"&&el.num==0&&chunktype=="GLUL"){result=image.slice(pos,pos+chunklen);}
if(el.usage=="Data"&&(chunktype=="TEXT"||chunktype=="BINA")){datachunks[el.num]={data:image.slice(pos,pos+chunklen),type:chunktype};}
if(el.usage=="Data"&&(chunktype=="FORM")){datachunks[el.num]={data:image.slice(pos-8,pos+chunklen),type:"BINA"};}}
return result;}
function decode_raw_text(str){var arr=Array(str.length);var ix;for(ix=0;ix<str.length;ix++){arr[ix]=str.charCodeAt(ix)&0xFF;}
return arr;}
if(window.atob){decode_base64=function(base64data){var data=atob(base64data);var image=Array(data.length);var ix;for(ix=0;ix<data.length;ix++)
image[ix]=data.charCodeAt(ix);return image;}}
else{var b64decoder=(function(){var b64encoder="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var out=[];var ix;for(ix=0;ix<b64encoder.length;ix++)
out[b64encoder.charAt(ix)]=ix;return out;})();decode_base64=function(base64data){var out=[];var c1,c2,c3,e1,e2,e3,e4;var i=0,len=base64data.length;while(i<len){e1=b64decoder[base64data.charAt(i++)];e2=b64decoder[base64data.charAt(i++)];e3=b64decoder[base64data.charAt(i++)];e4=b64decoder[base64data.charAt(i++)];c1=(e1<<2)+(e2>>4);c2=((e2&15)<<4)+(e3>>2);c3=((e3&3)<<6)+e4;out.push(c1,c2,c3);}
if(e4==64)
out.pop();if(e3==64)
out.pop();return out;}}
function start_game(image){if(image.length==0){all_options.io.fatal_error("No game file was loaded. (Zero-length response.)");return;}
if(image[0]==0x46&&image[1]==0x4F&&image[2]==0x52&&image[3]==0x4D){try{image=unpack_blorb(image);}
catch(ex){all_options.io.fatal_error("Blorb file could not be parsed: "+ex);return;}
if(!image){all_options.io.fatal_error("Blorb file contains no Glulx game!");return;}}
if(all_options.set_page_title){var title=null;if(metadata)
title=metadata.title;if(!title&&gameurl)
title=gameurl.slice(gameurl.lastIndexOf("/")+1);if(!title)
title='Game'
document.title=title+" - Quixe";}
all_options.vm.prepare(image,all_options);all_options.io.init(all_options);}
return{load_run:load_run,find_data_chunk:find_data_chunk};}();